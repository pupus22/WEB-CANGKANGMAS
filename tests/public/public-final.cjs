const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dist=fs.existsSync(path.resolve(__dirname,'../dist/public.js'))?path.resolve(__dirname,'../dist'):path.resolve(__dirname,'../..');
const root={innerHTML:'',querySelectorAll:()=>[],append(node){this.modal=node}};
const document={activeElement:null,body:{style:{overflow:''}},getElementById:id=>id==='public-root'?root:null,querySelector:()=>({setAttribute(){}}),events:{},addEventListener(k,fn){this.events[k]=fn},removeEventListener(k){delete this.events[k]},createElement(){const node={attrs:{},events:{},removed:false,setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.events[k]=fn},remove(){this.removed=true},querySelector(k){return this.controls[k]}};Object.defineProperty(node,'innerHTML',{set(html){this.html=html;this.controls=Object.fromEntries(['[data-prev]','[data-next]'].map(k=>[k,{focus(){document.activeElement=this}}]))},get(){return this.html}});return node}};
const ctx=vm.createContext({URL,URLSearchParams,structuredClone,console,setTimeout,clearTimeout,document,location:{pathname:'/',search:'',origin:'https://preview.test'},window:{}});
for(const f of ['site-data.js','firebase-config.js','public-assets.js'])vm.runInContext(fs.readFileSync(dist+'/'+f,'utf8').replaceAll('export ',''),ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'fixtures/public-fixture.js'),'utf8').replaceAll('export ',''),ctx);
const code=fs.readFileSync(dist+'/public.js','utf8').replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',"'https://preview.test/public.js'").replace(/render\(\);load\(\);\s*$/,'');vm.runInContext(code,ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('products.length'),0);assert.equal(run('gallery.length'),0);run('render()');assert(root.innerHTML.includes('Memuat harga'));assert(!root.innerHTML.includes('Rp23.500'));
const fake=()=>run('applyPublicData({exists:()=>true,data:()=>snapshot.config},{docs:snapshot.products.map(p=>({id:p.id,data:()=>p}))},{docs:snapshot.gallery.map(g=>({id:g.id,data:()=>g}))});loading=false');
fake();
for(const [key,field]of [['hero','heroImage'],['profile','profileImage'],['logo','logoImage']]){
 assert.equal(run(`photoSource(cfg.${field},'${key}')`),'/'+run(`bundledAssets['${key}'].optimized||bundledAssets['${key}'].file`));
 run(`cfg.${field}='https://drive.google.com/thumbnail?id=NEW_IMAGE_MARKER01&sz=w1600'`);
 assert(run(key==='hero'?'home()':key==='profile'?'profilePage()':'header()').includes('NEW_IMAGE_MARKER01'));
 run(`cfg.${field}=''`);assert.equal(run(`photoSource(cfg.${field},'${key}')`),'');
}
fake();run("products[0].image='https://drive.google.com/thumbnail?id=NEW_PRODUCT_MARKER01&sz=w1600'");assert(run('home()').includes('NEW_PRODUCT_MARKER01'));
run("products[0].image=''");assert(!run('card(products[0])').includes('/assets/images/horn.png'));
fake();const firstFile=run("photoSource(gallery[0].image,'gallery:'+gallery[0].id)");run('gallery.reverse()');assert.equal(run("photoSource(gallery[5].image,'gallery:'+gallery[5].id)"),firstFile);
const currentFile=run("photoSource(gallery[0].image,'gallery:'+gallery[0].id)");const firstTitle=run('gallery[0].title');
let restored=false;document.activeElement={focus(){restored=true}};run('openGallery(0)');assert(root.modal.html.includes(currentFile));assert(root.modal.html.includes(firstTitle));assert.equal(document.body.style.overflow,'hidden');
const modal=root.modal;document.events.keydown({key:'Tab',preventDefault(){}});assert.equal(document.activeElement,modal.controls['[data-next]']);
modal.controls['[data-next]'].onclick();assert(modal.html.includes(run("photoSource(gallery[1].image,'gallery:'+gallery[1].id)")));
modal.events.touchstart({touches:[{clientX:100}]});modal.events.touchend({changedTouches:[{clientX:10}]});assert(modal.html.includes(run("photoSource(gallery[2].image,'gallery:'+gallery[2].id)")));
document.events.keydown({key:'Escape'});assert(modal.removed);assert.equal(document.body.style.overflow,'');assert(restored);assert(!document.events.keydown);
run('openGallery(2)');root.modal.events.click({target:root.modal});assert(root.modal.removed);
run("gallery[0].image=''");assert(!run('galleryPage()').includes('data-gallery="0"'));
run("gallery[1].image='https://drive.google.com/thumbnail?id=NEW_GALLERY_MARKER01&sz=w1600'");assert(run('galleryPage()').includes('NEW_GALLERY_MARKER01'));run('openGallery(1)');assert(root.modal.html.includes('NEW_GALLERY_MARKER01'));run('closeActiveGallery()');
run('gallery[1].visible=false');assert(!run('galleryPage()').includes('NEW_GALLERY_MARKER01'));
run('applyPublicData({exists:()=>true,data:()=>snapshot.config},{docs:[]},{docs:[]})');assert.equal(run('products.length'),0);assert.equal(run('gallery.length'),0);assert(run('home()').includes('Belum ada produk'));assert(run('galleryPage()').includes('Foto galeri belum'));
assert(!code.includes('public-snapshot'));assert(!/\b(setDoc|updateDoc|deleteDoc|addDoc|writeBatch)\s*\(/.test(code));
(async()=>{
 run('fetchPublicData=async()=>[{exists:()=>true,data:()=>snapshot.config},{docs:[]},{docs:[]}]');await run('load()');assert.equal(run('products.length'),0);assert.equal(run('loading'),false);
 run("fetchPublicData=async()=>{throw Error('simulated offline')};loading=true;products=[];gallery=[]");await run('load()');assert(root.innerHTML.includes('Harga dan kontak terbaru belum dapat dimuat'));assert(!root.innerHTML.includes('Rp23.500'));
 console.log('PASS: live-data initialization, updated/cleared logo/hero/profile/product images, stable gallery IDs after reorder, clicked photo mapping, prev/next/swipe/Escape/outside-close/focus trap, empty collections and offline error. Simulated DOM; no authenticated/browser test.');
})().catch(e=>{console.error(e);process.exitCode=1});

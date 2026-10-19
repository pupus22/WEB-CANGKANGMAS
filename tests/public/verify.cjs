const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dist=fs.existsSync(path.resolve(__dirname,'../dist/public.js'))?path.resolve(__dirname,'../dist'):path.resolve(__dirname,'../..');
let source=fs.readFileSync(dist+'/public.js','utf8');
const root={innerHTML:'',querySelectorAll:()=>[]};
const document={getElementById:id=>id==='public-root'?root:null,querySelector:()=>({setAttribute(){}})};
const context=vm.createContext({URL,URLSearchParams,structuredClone,document,location:{pathname:'/',search:'',origin:'https://preview.test'},console,window:{}});
for(const file of ['site-data.js','firebase-config.js','public-assets.js'])vm.runInContext(fs.readFileSync(dist+'/'+file,'utf8').replaceAll('export ',''),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'fixtures/public-fixture.js'),'utf8').replaceAll('export ',''),context);
source=source.replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',"'https://preview.test/public.js'").replace(/render\(\);load\(\);\s*$/,'');
vm.runInContext(source,context);
vm.runInContext('cfg={...defaults,...snapshot.config};products=[...snapshot.products];gallery=[...snapshot.gallery];loading=false',context);
for(const route of ['/','/produk/','/produk/horn/','/produk/omega/','/galeri/','/profil/','/kontak/']){
 context.location.pathname=route;vm.runInContext('render()',context);const html=root.innerHTML;
 assert(html.includes('<h1'),'missing heading '+route);assert(html.includes('class="footer-login" href="https://cangkangmas.id/manajemen/"'),'footer login target');
 for(const [,ref]of html.matchAll(/(?:href|src)="(\/[^"?#]*)"/g)){
  const p=path.join(dist,ref);assert(fs.existsSync(p),'Missing '+ref+' on '+route);
 }
 assert(!html.includes('undefined'),'undefined content');
 console.log('PASS rendered route, local assets and links:',route);
}
vm.runInContext("page='detail';productId='missing'",context);assert(vm.runInContext('detail()',context).includes('Produk tidak ditemukan'));
vm.runInContext("products=[];gallery=[]",context);assert(vm.runInContext('catalog()',context).includes('Belum ada produk'));assert(vm.runInContext('galleryPage()',context).includes('Foto galeri belum'));
assert.equal(vm.runInContext("waLink('6285731929628','Halo Cangkang Mas')",context),'https://wa.me/6285731929628?text=Halo%20Cangkang%20Mas');
assert.equal(vm.runInContext('money(23500)',context),'Rp23.500');
assert(!/\b(setDoc|updateDoc|deleteDoc|addDoc|writeBatch)\s*\(/.test(source));
const css=fs.readFileSync(dist+'/public.css','utf8');assert(css.includes(':focus-visible'));assert(css.includes('prefers-reduced-motion'));assert(css.includes('min-width:600px')&&css.includes('min-width:1000px'));
for(const [fg,bg]of [['#ffffff','#102e50'],['#53667a','#ffffff'],['#53667a','#f1f5f8'],['#dce7f0','#102e50']]){
 const l=h=>{const v=h.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.03928?c/12.92:((c+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722};const a=l(fg),b=l(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert(ratio>=4.5);console.log('PASS contrast',fg,bg,ratio.toFixed(2));
}
console.log('PASS empty states, missing product, money, WhatsApp encoding, read-only Firebase, CSS accessibility rules. Browser visual and click-through QA not performed.');
context.location.pathname='/';context.location.hash='';vm.runInContext('products=[...snapshot.products];gallery=[...snapshot.gallery];render()',context);
assert.equal((root.innerHTML.match(/<main>/g)||[]).length,1,'single main landmark');
assert.equal((root.innerHTML.match(/<h1[ >]/g)||[]).length,1,'one H1');
for(const key of ['beranda','produk','galeri','profil','kontak']){
 assert(root.innerHTML.includes('id="'+key+'"'),'missing anchor '+key);
 assert(root.innerHTML.includes('href="/#'+key+'"'),'missing nav '+key);
}
assert(root.innerHTML.includes('data-gallery="0"'));assert(root.innerHTML.includes('<iframe class="map"'));
const ids=['beranda','produk','galeri','profil','kontak'];
let positions=[0,500,1000,1500,2000],scrolled='',queued;
const sections=ids.map((id,i)=>({id,getBoundingClientRect:()=>({top:positions[i]}),scrollIntoView:()=>{scrolled=id}}));
const links=ids.map(id=>({dataset:{section:id},active:false,attrs:{},classList:{toggle(k,val){links.find(l=>l.dataset.section===id).active=val}},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]}}));
const events={};context.document.documentElement={style:{setProperty(){}}};
root.querySelector=()=>({getBoundingClientRect:()=>({height:100})});
root.querySelectorAll=selector=>selector==='main > section[id]'?sections:selector==='[data-section]'?links:[];
context.window.addEventListener=(name,cb)=>{events[name]=cb};context.window.removeEventListener=name=>{delete events[name]};
context.requestAnimationFrame=cb=>{queued=cb;return 1};context.cancelAnimationFrame=()=>{};
context.location.hash='#galeri';vm.runInContext('setupSectionNav()',context);assert.equal(scrolled,'galeri');
positions=[-1200,-700,-200,300,800];events.scroll();queued();assert(links[2].active);assert.equal(links[2].attrs['aria-current'],'location');assert(!links[0].active);
vm.runInContext('cleanupSectionNav()',context);assert(!events.scroll&&!events.resize);
console.log('PASS one-page anchors, one H1/main, embedded gallery/maps, initial hash scroll, active Galeri state and event cleanup (simulated DOM; no browser click claim).');

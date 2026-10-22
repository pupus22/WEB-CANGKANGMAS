const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||process.cwd()]}));
const fs=require('fs'),path=require('path'),assert=require('assert'),http=require('http');
const root=path.resolve(__dirname,'../..'),site=path.join(root,'_site');
let snapshot=JSON.parse(fs.readFileSync(path.join(root,'tests/public/fixtures/public-fixture.js'),'utf8').replace(/^export const snapshot = /,'').replace(/;\s*$/,''));
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const server=http.createServer((req,res)=>{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname.endsWith('/'))pathname+='index.html';const file=path.join(site,pathname);if(!file.startsWith(site+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE,args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
 const context=await browser.newContext();let mode='normal';
 await context.route('https://www.gstatic.com/firebasejs/**',async route=>{
  const app=route.request().url().endsWith('firebase-app.js');
  const code=app?'export const initializeApp=()=>({});':`const read=async()=>{const r=await fetch('/__testdata');if(!r.ok)throw Error('offline test');return r.json()};export const getFirestore=()=>({});export const doc=(db,...p)=>p.join('/');export const collection=doc;export const getDoc=async()=>({exists:()=>true,data:()=>globalThis.__cmsConfig||{}});export const getDocs=async p=>{const d=await read();return {docs:(p.includes('products')?d.products:d.gallery).map(v=>({id:v.id,data:()=>v}))}};export const setDoc=async(p,data)=>{globalThis.__saved={p,data};globalThis.__cmsConfig=data};export const deleteDoc=async()=>{};`;
  await route.fulfill({contentType:'text/javascript',body:code});
 });
 await context.route('**/__testdata',route=>route.fulfill({status:mode==='offline'?503:200,contentType:'application/json',body:JSON.stringify(mode==='empty'?{products:[],gallery:[]}:snapshot)}));
 await context.route('https://www.google.com/**',route=>route.fulfill({body:''}));
 await context.route('https://drive.google.com/**',route=>route.fulfill({body:fs.readFileSync(path.join(site,'assets/images/horn.png')),contentType:'image/png'}));
 await context.addInitScript(config=>{globalThis.__cmsConfig=config},snapshot.config);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,412,768,1366]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/produk/','/produk/horn/','/produk/omega/','/galeri/','/profil/','/kontak/']){
   await page.goto(base+route);await page.waitForFunction(()=>document.getElementById('site-message')?.textContent==='');
   assert.equal(await page.locator('h1').count(),1,route+' H1');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
   if(route==='/'||route==='/produk/')assert(await page.locator('.grid>.card>.photo').first().evaluate(el=>{const r=el.getBoundingClientRect();return r.height/r.width<1.1}),route+' photo proportion '+width);
   const actual=await page.locator('link[rel=canonical]').getAttribute('href');assert.equal(actual,'https://cangkangmas.id'+route);
   if(route.includes('/produk/horn')){const schema=JSON.parse(await page.locator('#public-schema').textContent());assert.equal(schema['@graph'].find(x=>x['@type']==='Product').offers.price,24000);}
  }
 }
 await page.goto(base+'/');await page.waitForFunction(()=>document.getElementById('site-message')?.textContent==='');
 await page.setViewportSize({width:412,height:900});await page.locator('img[loading=lazy]').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});await page.screenshot({path:path.join(root,'../../seo-home-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1366,height:900});await page.screenshot({path:path.join(root,'../../seo-home-desktop.png'),fullPage:true});
 await page.locator('.nav a[data-section="produk"]').click();assert(new URL(page.url()).hash==='#produk');
 await page.locator('[data-gallery]').first().click();assert.equal(await page.locator('[role=dialog]').count(),1);await page.locator('[data-next]').click();await page.keyboard.press('Escape');assert.equal(await page.locator('[role=dialog]').count(),0);
 await page.locator('[data-gallery]').first().click();await page.locator('.lightbox').click({position:{x:3,y:3}});assert.equal(await page.locator('[role=dialog]').count(),0);
 const wa=await page.locator('.float-wa').getAttribute('href');assert(wa.startsWith('https://wa.me/6285731929628'));
 await page.evaluate(()=>navigator.clipboard.writeText=async value=>{window.__shared=value});await page.locator('[data-share]').first().click();assert((await page.evaluate(()=>window.__shared)).endsWith('/produk/horn/'));
 await page.locator('.product-detail-link').first().click();await page.waitForURL('**/produk/horn/');
 await page.evaluate(async()=>{const {mountWebsitePublic}=await import('/manajemen/website-public.js');await mountWebsitePublic({container:document.getElementById('public-root'),db:{},uid:'test',notify:()=>{}})});
 await page.locator('[data-tab="seo"]').click();await page.locator('[data-field="beranda title"]').fill('Judul hasil edit admin');await page.locator('[data-field="beranda description"]').fill('Deskripsi hasil edit admin');await page.locator('#pub-seo button[type=submit]').click();
 const saved=await page.evaluate(()=>window.__saved);assert.equal(saved.data.seo.beranda.title,'Judul hasil edit admin');assert.equal(saved.p,'publicSite/config');snapshot.config=saved.data;
 await context.addInitScript(config=>{globalThis.__cmsConfig=config},snapshot.config);
 await page.goto(base+'/');await page.waitForFunction(()=>document.title==='Judul hasil edit admin');assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'),'Judul hasil edit admin');
 mode='empty';await page.goto(base+'/produk/horn/');await page.waitForFunction(()=>document.title.includes('tidak ditemukan'));assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');
 mode='offline';await page.goto(base+'/produk/');await page.waitForFunction(()=>document.getElementById('site-message')?.textContent.includes('belum dapat dimuat'));assert(!(await page.locator('.prices').innerText().catch(()=>'' )).includes('Rp'));
 assert.deepEqual(errors,[]);
 const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(base+'/produk/horn/');assert.equal(await staticPage.locator('h1').count(),1);assert(!(await staticPage.locator('.prices').innerText()).includes('Rp'));assert((await staticPage.locator('meta[property="og:image"]').getAttribute('content')).includes('/assets/'));
 await staticPage.screenshot({path:path.join(root,'../../seo-static-mobile.png'),fullPage:true});
 await browser.close();server.close();console.log('PASS: 28 page/viewport checks; navigation; gallery next/Escape/outside close; WA URL; share copy; product link; CMS save to mocked Firebase and updated SEO/OG; missing/empty/offline; no-JS content; no page errors. No production writes.');
})().catch(e=>{console.error(e);server.close();process.exit(1)});

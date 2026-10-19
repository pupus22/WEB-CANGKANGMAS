const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dir=path.resolve(__dirname,'../..');
for(const prefix of ['/','/WEB-CANGKANGMAS/']){
 const root={innerHTML:'',querySelectorAll:()=>[]};const ctx=vm.createContext({URL,URLSearchParams,structuredClone,console,window:{},document:{getElementById:id=>id==='public-root'?root:null,querySelector:()=>({setAttribute(){}})},location:{pathname:prefix,search:'',origin:'https://example.test'}});
 for(const f of ['site-data.js','firebase-config.js','public-assets.js'])vm.runInContext(fs.readFileSync(dir+'/'+f,'utf8').replaceAll('export ',''),ctx);
 vm.runInContext(fs.readFileSync(__dirname+'/fixtures/public-fixture.js','utf8').replaceAll('export ',''),ctx);
 vm.runInContext(fs.readFileSync(dir+'/public.js','utf8').replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',JSON.stringify('https://example.test'+prefix+'public.js')).replace(/render\(\);load\(\);\s*$/,''),ctx);
 vm.runInContext('cfg={...defaults,...snapshot.config};products=[...snapshot.products];gallery=[...snapshot.gallery];loading=false;',ctx);
 for(const route of ['','produk/','produk/horn/','produk/omega/','galeri/','profil/','kontak/']){
  ctx.location.pathname=prefix+route;vm.runInContext('render()',ctx);
  for(const [,url]of root.innerHTML.matchAll(/(?:href|src)="(\/[^"?#]*)"/g)){
   assert(url.startsWith(prefix),'broken prefix '+url);assert(fs.existsSync(path.join(dir,url.slice(prefix.length))),'missing '+url);
  }
 }
 console.log('PASS seven routes and asset links with prefix '+prefix);
}

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {defaults,improvePublicCopy,improveProductCopy} from '../site-data.js';
import {firebaseConfig} from '../firebase-config.js';
import {pageSeo,seoHead,escapeHtml,jsonForHtml} from '../public-seo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, process.env.SEO_OUTPUT || '_site');
if (out === root || !out.startsWith(root + path.sep)) throw Error('Output must be a subdirectory of the source.');
const base = 'https://cangkangmas.id/';
const api = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/`;
function decode(v) {
  if ('nullValue' in v) return null;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return fields(v.mapValue.fields || {});
  return v.stringValue ?? v.timestampValue ?? '';
}
const fields = values => Object.fromEntries(Object.entries(values).map(([k,v])=>[k,decode(v)]));
async function request(suffix) {
  const response = await fetch(api + suffix, {signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw Error(`Public data request failed: ${response.status}`);
  return response.json();
}
async function collection(suffix) {
  let token = '', result = [];
  do {
    const response = await request(suffix + '?pageSize=100' + (token ? '&pageToken=' + encodeURIComponent(token) : ''));
    result.push(...(response.documents || []).map(d=>({...fields(d.fields || {}),id:d.name.split('/').pop()})));
    token = response.nextPageToken || '';
  } while (token);
  return result.sort((a,b)=>(a.position||0)-(b.position||0));
}
let data;
const snapshotArg = process.argv.indexOf('--snapshot');
if (snapshotArg !== -1) data = JSON.parse(await fs.readFile(process.argv[snapshotArg + 1], 'utf8'));
else {
  const [config,products,gallery] = await Promise.all([request('publicSite/config'),collection('publicSite/products/items'),collection('publicSite/gallery/items')]);
  data = {config:fields(config.fields || {}),products,gallery};
}
if (!data.config || !Array.isArray(data.products) || !Array.isArray(data.gallery)) throw Error('Invalid public data.');
const config = improvePublicCopy({...structuredClone(defaults),...data.config,seo:{...defaults.seo,...data.config.seo},buttons:{...defaults.buttons,...data.config.buttons}});
// Price and stock snapshots must not become a second source of truth.
const products = data.products.filter(p=>p.visible!==false).map(p=>improveProductCopy({...p,retail:null,wholesale:null,status:''}));
const gallery = data.gallery.filter(g=>g.visible!==false);
await fs.rm(out, {recursive:true,force:true});
const excluded = new Set(['_site','node_modules','.git','scripts','tests','.github']);
for (const name of await fs.readdir(root)) {
  if (excluded.has(name) || path.resolve(root,name) === out || name.endsWith('.zip')) continue;
  await fs.cp(path.join(root,name),path.join(out,name),{recursive:true});
}
const assetModule = await import('../public-assets.js');
let assets = structuredClone(assetModule.bundledAssets);
const optimized = spawnSync(process.env.PYTHON || 'python3',[path.join(root,'scripts/optimize-images.py'),out],{input:JSON.stringify(assets),encoding:'utf8'});
if (optimized.status !== 0) throw Error(optimized.stderr || 'Image optimization failed');
assets = JSON.parse(optimized.stdout);
// Inline CMS images need public file URLs for social crawlers.
const entries = [['hero',config.heroImage],['logo',config.logoImage],['profile',config.profileImage],...products.map(p=>['product:'+p.id,p.image]),...gallery.map(g=>['gallery:'+g.id,g.image])];
for (const [key,value] of entries) {
  const match = typeof value === 'string' && value.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match || value.length >= 750000) continue;
  const {createHash} = await import('node:crypto');
  const bytes=Buffer.from(match[2],'base64'),file=`assets/seo/${createHash('sha256').update(bytes).digest('hex').slice(0,20)}.${match[1]}`;
  await fs.mkdir(path.join(out,'assets/seo'),{recursive:true});await fs.writeFile(path.join(out,file),bytes);
  assets[key]={source:value,file};
}
await fs.writeFile(path.join(out,'public-assets.js'),'export const bundledAssets = '+JSON.stringify(assets)+';\n');
const initial = {config,products,gallery};
const context=vm.createContext({URL,URLSearchParams,structuredClone,console,document:{getElementById:()=>null,querySelector:()=>null},location:{pathname:'/',search:'',hash:'',origin:base.slice(0,-1)}});
for (const name of ['site-data.js','firebase-config.js']) vm.runInContext((await fs.readFile(path.join(root,name),'utf8')).replaceAll('export ',''),context);
context.assetData=assets;context.initialData=initial;
vm.runInContext('const bundledAssets=assetData;',context);
const code=(await fs.readFile(path.join(root,'public.js'),'utf8')).replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',JSON.stringify(base+'public.js')).replace(/render\(\);load\(\);\s*$/,'');
vm.runInContext(code,context);
vm.runInContext('cfg=initialData.config;products=initialData.products;gallery=initialData.gallery;primary=(cfg.contacts||[]).find(c=>c.primary&&c.active!==false&&c.number)||null;',context);
const imageSource=(value,key)=>{
  const a=assets[key];
  if(a && value===a.source)return new URL(a.optimized||a.file,base).href;
  if(typeof value==='string' && (/^https:\/\/drive\.google\.com\/thumbnail\?id=[A-Za-z0-9_-]+/.test(value)||/^\/?assets\/[A-Za-z0-9_./-]+$/.test(value)))return new URL(value,base).href;
  return '';
};
const routes=[['','beranda'],['produk/','produk'],['galeri/','galeri'],['profil/','profil'],['kontak/','kontak'],['produk/horn/','detail','horn'],['produk/omega/','detail','omega']];
const sitemap=[];
for (const [route,page,id=''] of routes) {
  context.location.pathname='/'+route;
  vm.runInContext('pathPage()',context);
  const missing=page==='detail'&&!products.some(p=>p.id===id);
  if(missing)vm.runInContext('loading=false',context);
  const body=vm.runInContext("header()+({beranda:home,produk:catalog,galeri:galleryPage,profil:profilePage,kontak:contactPage,detail}[page])()+footer()+(primary?`<a class=\"float-wa\" href=\"${esc(primaryLink())}\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Chat WhatsApp utama\">${waIcon()}</a>`:'')",context);
  vm.runInContext('loading=true',context);
  const meta=pageSeo({config,products,page,productId:id,base,imageSource,missing});
  const relative='../'.repeat(route.split('/').filter(Boolean).length);
  const html=`<!doctype html>\n<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#102e50">\n${seoHead(meta)}\n<link rel="icon" href="${relative}assets/logo.png"><link rel="stylesheet" href="${relative}public.css"><link rel="preconnect" href="https://www.gstatic.com" crossorigin><link rel="preconnect" href="https://firestore.googleapis.com" crossorigin></head><body><div id="public-root">${body}<div id="site-message" role="status">Memuat harga dan informasi terbaru…</div></div><noscript><p class="notice">Aktifkan JavaScript untuk melihat harga terbaru dan membuka foto galeri. Hubungi WhatsApp untuk konfirmasi harga dan stok.</p></noscript><script id="public-content" type="application/json">${jsonForHtml(initial)}</script><script type="module" src="${relative}public.js"></script></body></html>\n`;
  const target=path.join(out,route,'index.html');await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,html);
  if(meta.robots==='index,follow')sitemap.push(meta.url);
}
await fs.writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(url=>`  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
await fs.writeFile(path.join(out,'seo-build.json'),JSON.stringify({builtAt:new Date().toISOString(),pages:routes.length,source:snapshotArg===-1?'public-firestore':'explicit-snapshot',staticPrices:false},null,2));
console.log(`Built ${routes.length} public pages in ${out}. Static prices omitted. Source: ${snapshotArg===-1?'live public Firestore':'explicit snapshot'}.`);

const clean=value=>String(value||'').replace(/[\r\n]+/g,' ').trim();
const links=routes.filter(([route,page])=>config.seo?.[page==='detail'?'produk':page]?.index!==false).filter(([route,page,id])=>page!=='detail'||products.some(p=>p.id===id));
await fs.writeFile(path.join(out,'llms.txt'),`# ${clean(config.name)}

> ${clean(config.profileText)}

## Informasi usaha
- Lokasi: ${clean(config.address||config.region)}
- Wilayah layanan: ${clean(config.region)}
${config.hours?'- Jam operasional: '+clean(config.hours)+'\n':''}
## Halaman publik
${links.map(([route,page,id])=>'- ['+clean(id?products.find(p=>p.id===id).name:({beranda:'Beranda',produk:'Produk dan harga',galeri:'Galeri',profil:'Profil',kontak:'Kontak'}[page]))+']('+new URL(route,base).href+')').join('\n')}

## Harga dan pemesanan
Harga dan ketersediaan dapat berubah. Gunakan halaman produk dan konfirmasi melalui kontak resmi. ${clean(config.orderText)}
`);

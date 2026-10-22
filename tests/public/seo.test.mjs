import assert from 'node:assert/strict';
import {test} from 'node:test';
import {pageSeo,seoHead,jsonForHtml} from '../../public-seo.mjs';
import {defaults,defaultProducts} from '../../site-data.js';
const config={...defaults,address:'Surabaya Selatan',contacts:[{primary:true,active:true,number:'085731929628'}]};
const products=defaultProducts.map(p=>({...p,retail:24000,image:'/assets/images/'+p.id+'.png'}));
const make=extra=>pageSeo({config,products,page:'detail',productId:'horn',imageSource:v=>v,...extra});
test('static product markup has no stale price or stock',()=>{
 const meta=make();const product=meta.schema['@graph'].find(x=>x['@type']==='Product');
 assert(product);assert(!product.offers);assert(meta.image.endsWith('/horn.png'));
 assert.equal(meta.schema['@graph'][0].telephone,'+6285731929628');
 assert(!meta.schema['@graph'][0].openingHours);
});
test('live offer uses retail per kilogram; no null price becomes zero',()=>{
 let product=make({live:true}).schema['@graph'].find(x=>x['@type']==='Product');
 assert.equal(product.offers.price,24000);assert.equal(product.offers.priceSpecification.referenceQuantity.unitCode,'KGM');
 for(const value of [null,'',undefined,NaN,-1,0]){product=make({live:true,products:[{...products[0],retail:value}]}).schema['@graph'].find(x=>x['@type']==='Product');assert(!product.offers)}
 product=make({live:true,products:[{...products[0],status:'out'}]}).schema['@graph'].find(x=>x['@type']==='Product');assert(product.offers.availability.endsWith('/OutOfStock'));
});
test('saved title, description, image removal and index toggle propagate',()=>{
 const custom={...config,seo:{...config.seo,produk:{title:'Judul Baru',description:'Deskripsi Baru',index:false}}};
 assert.equal(make({config:custom,page:'produk'}).title,'Judul Baru');
 assert.equal(make({config:custom}).robots,'noindex,follow');
 assert.equal(make({config:{...custom,seo:{produk:{index:true}}}}).robots,'index,follow');
 assert.equal(make({products:[{...products[0],image:''}]}).image,'');
 const missing=make({products:[],missing:true});assert.equal(missing.robots,'noindex,follow');assert(!missing.schema['@graph'].some(x=>x['@type']==='Product'));
});
test('metadata escapes CMS text and JSON script terminators',()=>{
 const attack='</script><script>alert(1)</script>';
 const meta=make({products:[{...products[0],seoTitle:attack,description:attack}]});
 assert(!jsonForHtml(meta.schema).includes('</script>'));assert(seoHead(meta).includes('&lt;/script&gt;'));
});

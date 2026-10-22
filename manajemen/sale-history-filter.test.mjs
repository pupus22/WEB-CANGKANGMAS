import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {filterSaleHistory} from './sale-history-filter.mjs';
const contacts={c1:{name:'Toko Sumber Makmur'}};
const products={horn:{name:'HORN'},omega:{name:'OMEGA'}};
const events=[
 {id:'mixed',type:'sale',date:'2026-10-22',data:{partyId:'c1',channel:'shopee',note:'Pesanan SPX-123',items:[{productId:'horn'},{productId:'omega'}]}},
 {id:'legacy',type:'sale',date:'2026-10-01',data:{productId:'horn',note:'Antar pagi'}},
 {id:'online',type:'sale',date:'2026-09-30',data:{channel:'online',items:[{productId:'omega'}]}},
 {id:'void',type:'sale',voided:true,date:'2026-10-22',data:{productId:'omega'}},
 {id:'purchase',type:'purchase',date:'2026-10-22',data:{productId:'horn'}}
];
const before=JSON.stringify(events);
const select=f=>filterSaleHistory(events,f,contacts,products).map(e=>e.id);
assert.deepEqual(select({}),['mixed','legacy','online']);
assert.deepEqual(select({query:'  SUMBER  spx-123 '}),['mixed']);
assert.deepEqual(select({query:'mixed'}),['mixed']);
assert.deepEqual(select({query:'pembeli umum',channel:'offline'}),['legacy']);
assert.deepEqual(select({from:'2026-10-01',to:'2026-10-22'}),['mixed','legacy']);
assert.deepEqual(select({from:'2026-10-22',to:'2026-10-22'}),['mixed']);
assert.deepEqual(select({from:'2026-10-23',to:'2026-10-01'}),[]);
assert.deepEqual(select({product:'omega'}),['mixed','online']);
assert.deepEqual(select({product:'horn',channel:'offline'}),['legacy']);
assert.deepEqual(select({query:'omega',channel:'shopee',from:'2026-10-22',product:'omega'}),['mixed']);
assert.deepEqual(select({query:'<script>'}),[]);
assert.deepEqual(filterSaleHistory([{id:'empty',type:'sale'}],{from:'2026-10-01'}),[]);
assert.deepEqual(select({query:'tidak ada'}),[]);
assert.equal(JSON.stringify(events),before,'Filtering must not mutate transaction data');
// Exercise the actual sale screen and its last-page handler without Firebase.
const next={dataset:{salePage:'last'}};
const content={innerHTML:''};
const nav={querySelectorAll:()=>[]};
const context=vm.createContext({filterSaleHistory,Date,console,globalThis,
 replay:()=>({}),document:{addEventListener:()=>{},getElementById:id=>id==='content'?content:id==='nav'?nav:['modal','modalClose','modalBody'].includes(id)?{addEventListener:()=>{}}:null,
 querySelectorAll:selector=>selector==='[data-sale-page]'?[next]:[]}});
const source=fs.readFileSync(new URL('./app.js',import.meta.url),'utf8').split('async function boot()')[0].replace(/^import .*;\n/gm,'');
vm.runInContext(source,context);
vm.runInContext(`uid='test';loaded=true;view='sale';
 calc={products:{horn:{id:'horn',name:'HORN'},omega:{id:'omega',name:'OMEGA'}},contacts:{},stock:{}};
 monthlyReportFigures=()=>({});historyRows=rows=>rows.map(e=>e.id).join(',');
 events=Array.from({length:35},(_,i)=>({id:'sale-'+i,type:'sale',date:'2026-10-22',data:{productId:i<12?'omega':'horn'}}));
 compareEvents=(a,b)=>a.id.localeCompare(b.id);saleFilters={product:'omega'};render();`,context);
assert(content.innerHTML.includes('12 dari 35 transaksi'));
assert(content.innerHTML.includes('id="saleFilterForm"'));
next.onclick();
assert.equal(vm.runInContext('salePage',context),2,'Last page uses the filtered count');
assert(content.innerHTML.includes('Halaman <b>2</b> / 2'));
vm.runInContext("saleFilters={query:'<script>'};render()",context);
assert(content.innerHTML.includes('&lt;script&gt;'));
assert(content.innerHTML.includes('Tidak ada penjualan yang sesuai'));
assert.equal(vm.runInContext('salePage',context),1);
console.log('PASS: sales filters, combined conditions, inclusive dates, legacy/multi-item, voided data, no mutation');
console.log('PASS: simulated sale screen, escaped search input, empty state and filtered pagination');

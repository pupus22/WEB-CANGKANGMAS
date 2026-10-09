import assert from 'node:assert/strict';
import {replay,integer} from './engine.mjs';
let seq=0;const E=(type,date,data,id='e'+(++seq))=>({id,type,date,data,seq,voided:false});
const d='2026-09-24';let tests=0;const test=(label,fn)=>{fn();tests++;console.log('PASS '+tests+' '+label)};
const p=E('product',d,{name:'HORN'},'horn'),c=E('contact',d,{name:'Andi',kind:'customer'},'andi'),s=E('contact',d,{name:'Kandang',kind:'supplier'},'kandang');
const initial=E('initial',d,{trayAvailable:8,trayCost:2000}),buy=E('purchase',d,{productId:'horn',partyId:'kandang',weight:10000,price:23500,extra:0,trayIn:8,trayOut:8,trayBought:0}),buy2=E('purchase',d,{productId:'horn',weight:15000,price:24000,extra:0});
const sale=E('sale',d,{productId:'horn',partyId:'andi',weight:12000,price:25000,paid:100000,channel:'offline',trayOut:8,trayIn:7,trayBought:1,trayPrice:2000,delivery:5000,extra:500,pay:'credit'}),pay=E('settlement',d,{partyId:'andi',invoiceId:sale.id,mode:'debt',amount:100000});
const base=[p,c,s,initial,buy,buy2,sale,pay];
test('format angka titik ribuan saja',()=>{assert.equal(integer('30.000'),30000);assert.throws(()=>integer('1.500,50'));});
test('FIFO dari lot tertua',()=>{const r=replay(base);assert.equal(r.stock.horn,13000);assert.equal(r.outcomes[sale.id].cogs,283000+2000);assert.equal(r.products.horn.lots[0].qty,13000)});
test('tray tukar dan beli tidak dihitung ganda',()=>{const r=replay(base);assert.equal(r.tray.available,7);assert.equal(r.contacts.andi.trayDue,0);assert.equal(r.contacts.kandang.trayDue,0)});
test('bon terikat nota dan cicilan tidak menambah omzet',()=>{const r=replay(base);assert.equal(r.invoices[sale.id].debt,107000);assert.equal(r.contacts.andi.debt,107000);assert.equal(r.outcomes[pay.id].revenue,0)});
test('koreksi berat kulak lebih kecil dari penjualan ditolak',()=>assert.throws(()=>replay(base.map(e=>e.id===buy.id?{...e,data:{...e.data,weight:7000}}:e).map(e=>e.id===buy2.id?{...e,voided:true}:e)),/Stok HORN kurang/));
test('koreksi kulak lebih besar menghitung ulang stok',()=>{const r=replay(base.map(e=>e.id===buy.id?{...e,data:{...e.data,weight:12000}}:e));assert.equal(r.stock.horn,15000)});
test('hapus jual salah input pulihkan seluruh saldo tanpa cicilan yatim',()=>{assert.throws(()=>replay(base.map(e=>e.id===sale.id?{...e,voided:true}:e)),/Nota bon tidak ditemukan/);const r=replay(base.map(e=>[sale.id,pay.id].includes(e.id)?{...e,voided:true}:e));assert.equal(r.stock.horn,25000);assert.equal(r.contacts.andi.debt,0);assert.equal(r.tray.available,8)});
test('koreksi harga kulak hitung ulang laba otomatis',()=>{const original=replay(base);const corrected=replay(base.map(e=>e.id===buy.id?{...e,data:{...e.data,price:24500}}:e));assert.equal(original.outcomes[sale.id].profit-corrected.outcomes[sale.id].profit,10000)});
test('retur customer tidak kurangi stok kedua kali',()=>{const r=E('return',d,{direction:'customer',partyId:'andi',productId:'horn',weight:500,resolution:'replace'});const after=replay([...base,r]);assert.equal(after.stock.horn,13000);assert.equal(after.contacts.andi.eggDue,500)});
test('telur pengganti kurangi stok saat dikirim',()=>{const r=E('return',d,{direction:'customer',partyId:'andi',productId:'horn',weight:500,resolution:'replace'}),rep=E('settlement',d,{partyId:'andi',productId:'horn',claimId:r.id,weight:500,mode:'egg'});const after=replay([...base,r,rep]);assert.equal(after.stock.horn,12500);assert.equal(after.contacts.andi.eggDue,0)});
test('biaya bersama kurangi total bukan laba offline secara keliru',()=>{const cost=E('expense',d,{amount:15000,channel:'shared',name:'Bensin'}),r=replay([...base,cost]);assert.equal(r.period[d.slice(0,7)+'|shared'].profit,-15000);assert.equal(r.period[d.slice(0,7)+'|offline'].profit,replay(base).period[d.slice(0,7)+'|offline'].profit)});
test('penjualan Shopee net tidak dipotong lagi',()=>{const r=replay([p,E('purchase',d,{productId:'horn',weight:1000,price:23500}),E('sale',d,{productId:'horn',weight:1000,channel:'shopee',net:26970,extra:500})]);assert.equal(Object.values(r.period).find(x=>x.revenue===26970).profit,2970)});
test('edit pembayaran lebih kecil dari cicilan ditolak',()=>{assert.throws(()=>replay(base.map(e=>e.id===sale.id?{...e,data:{...e.data,price:10000}}:e)),/Pembayaran (awal melebihi total|melebihi sisa bon nota)/)});
test('penambahan tray awal koreksi tray benar',()=>{const r=replay([...base,E('adjust',d,{productId:'',trayAvailable:20,trayBroken:2,trayCost:2000})]);assert.equal(r.tray.available,20);assert.equal(r.tray.broken,2)});
console.log('TOTAL '+tests+' pengujian lulus');

test('retur refund terkait nota dibebankan pada offline',()=>{const r=E('return',d,{direction:'customer',partyId:'andi',productId:'horn',invoiceId:sale.id,weight:500,resolution:'refund',refund:12000});const before=replay(base),after=replay([...base,r]);assert.equal(after.period['2026-09|offline'].profit,before.period['2026-09|offline'].profit-12000);assert.equal(after.contacts.andi.refundDue,12000)});
test('refund customer diselesaikan tanpa laba dipotong dua kali',()=>{const r=E('return',d,{direction:'customer',partyId:'andi',productId:'horn',invoiceId:sale.id,weight:500,resolution:'refund',refund:12000}),refund=E('settlement',d,{partyId:'andi',claimId:r.id,mode:'refund',amount:12000});const after=replay([...base,r,refund]);assert.equal(after.contacts.andi.refundDue,0);assert.equal(after.outcomes[refund.id].profit,0)});
test('hapus transaksi retur yang sudah dibayar ditolak sampai refund terkait dibatalkan',()=>{const r=E('return',d,{direction:'customer',partyId:'andi',productId:'horn',invoiceId:sale.id,weight:500,resolution:'refund',refund:12000}),refund=E('settlement',d,{partyId:'andi',claimId:r.id,mode:'refund',amount:12000});assert.throws(()=>replay([...base,{...r,voided:true},refund]),/Pilih retur/)});
test('bon awal bisa dilunasi sesuai nota saldo awal',()=>{const initialDebt=E('initial',d,{partyId:'andi',debt:300000}),rep=E('settlement',d,{partyId:'andi',invoiceId:initialDebt.id,mode:'debt',amount:100000});const r=replay([c,initialDebt,rep]);assert.equal(r.contacts.andi.debt,200000);assert.equal(r.invoices[initialDebt.id].debt,200000)});
test('beli tray yang dipinjam tidak mengurangi fisik dua kali',()=>{const loan=E('tray',d,{mode:'loan',partyId:'andi',out:4,in:0}),convert=E('tray',d,{mode:'convert',partyId:'andi',out:2,in:0,price:2500,paid:5000});const r=replay([c,initial,loan,convert]);assert.equal(r.tray.available,4);assert.equal(r.contacts.andi.trayDue,2)});
console.log('TOTAL FINAL '+tests+' pengujian lulus');
test('HPP gram satuan dibulatkan konsisten tanpa akumulasi selisih',()=>{
 const es=[p,E('purchase',d,{productId:'horn',weight:1001,price:23500})];
 for(let i=0;i<1001;i++)es.push(E('sale',d,{productId:'horn',weight:1,price:25000,channel:'offline'}));
 const r=replay(es),sum=es.filter(e=>e.type==='sale').reduce((n,e)=>n+r.outcomes[e.id].cogs,0);
 assert.equal(sum,Math.round(1001*23500/1000));assert.equal(r.stock.horn,0);
});
console.log('TOTAL FINAL '+tests+' pengujian lulus');
test('transaksi historis dapat diinput setelah jenis telur dibuat',()=>{const p2=E('product','2026-09-24',{name:'OMEGA'},'omega');const b=E('purchase','2026-09-10',{productId:'omega',weight:10000,price:27000});const r=replay([p2,b]);assert.equal(r.stock.omega,10000)});
console.log('TOTAL FINAL '+tests+' pengujian lulus');
test('penghapusan customer yang masih dipakai transaksi ditolak',()=>{
 assert.throws(()=>replay(base.map(e=>e.id===c.id?{...e,voided:true}:e)),/customer\/supplier pada transaksi tidak ditemukan|Customer\/supplier pada transaksi tidak ditemukan/);
});
test('penghapusan jenis telur yang masih dipakai ditolak',()=>{
 assert.throws(()=>replay(base.map(e=>e.id===p.id?{...e,voided:true}:e)),/Jenis telur tidak ditemukan/);
});
test('tanggal penjualan dimajukan sebelum ada stok ditolak',()=>{
 assert.throws(()=>replay(base.map(e=>e.id===sale.id?{...e,date:'2026-09-01'}:e)),/(Stok HORN kurang|tray tersedia 0)/);
});
test('kas: kulak keluar, penjualan dan cicilan masuk, tanpa omzet ganda',()=>{
 const r=replay(base),flow=r.cash['2026-09'];assert.equal(flow.in,200000);assert.equal(flow.out,235000+15000*24);assert.equal(r.outcomes[pay.id].revenue,0);
});
test('koreksi transaksi biaya operasional membalik laba dan kas',()=>{
 const expense=E('expense',d,{amount:10000,pay:'qris',channel:'offline',name:'Parkir'});
 const original=replay([...base,expense]);const corrected=replay([...base,{...expense,data:{...expense.data,amount:5000}}]);
 assert.equal(corrected.period['2026-09|offline'].profit-original.period['2026-09|offline'].profit,5000);
 assert.equal(corrected.cash['2026-09'].out,original.cash['2026-09'].out-5000);
});
test('edit harga jual harian tidak mengubah jenis telur atau harga kulak',()=>{
 const corrected=replay(base.map(e=>e.id===sale.id?{...e,data:{...e.data,price:26000}}:e));assert.equal(corrected.invoices[sale.id].revenue,319000);assert.equal(corrected.products.horn.name,'HORN');assert.equal(corrected.outcomes[sale.id].cogs,285000);
});
console.log('TOTAL FINAL '+tests+' pengujian lulus');
test('retur Pembeli umum dari nota tanpa customer diizinkan',()=>{
 const stock=E('purchase','2026-09-23',{productId:'horn',weight:2000,price:22000});
 const saleGeneral=E('sale',d,{productId:'horn',weight:1000,price:25000,paid:25000,channel:'offline'});
 const ret=E('return',d,{direction:'customer',partyId:'',productId:'horn',invoiceId:saleGeneral.id,weight:100,resolution:'none'});
 const r=replay([p,stock,saleGeneral,ret]);
 assert.equal(r.stock.horn,1000);
});
test('refund Pembeli umum dapat diselesaikan tanpa membuat customer',()=>{
 const stock=E('purchase','2026-09-23',{productId:'horn',weight:2000,price:22000});
 const saleGeneral=E('sale',d,{productId:'horn',weight:1000,price:25000,paid:25000,channel:'offline'});
 const ret=E('return',d,{direction:'customer',partyId:'',productId:'horn',invoiceId:saleGeneral.id,weight:100,resolution:'refund',refund:2500});
 const refund=E('settlement',d,{partyId:'',claimId:ret.id,mode:'refund',amount:2500,pay:'cash'});
 const r=replay([p,stock,saleGeneral,ret,refund]);
 assert.equal(r.claims[ret.id].refundDue,0);
 assert.equal(r.outcomes[refund.id].profit,0);
});
test('penggantian telur Pembeli umum dapat diselesaikan dan mengurangi stok',()=>{
 const stock=E('purchase','2026-09-23',{productId:'horn',weight:2000,price:22000});
 const saleGeneral=E('sale',d,{productId:'horn',weight:1000,price:25000,paid:25000,channel:'offline'});
 const ret=E('return',d,{direction:'customer',partyId:'',productId:'horn',invoiceId:saleGeneral.id,weight:100,resolution:'replace'});
 const rep=E('settlement',d,{partyId:'',productId:'horn',claimId:ret.id,mode:'egg',weight:100});
 const r=replay([p,stock,saleGeneral,ret,rep]);
 assert.equal(r.claims[ret.id].eggDue,0);
 assert.equal(r.stock.horn,900);
});
console.log('TOTAL FINAL '+tests+' pengujian lulus');
test('timestamp mengurutkan transaksi dalam hari yang sama',()=>{
 const pp=E('product','2026-10-05',{name:'OMEGA'},'omega-time');
 const ss=E('contact','2026-10-05',{name:'Supplier A',kind:'supplier'},'sup-time');
 const buy=E('purchase','2026-10-05',{productId:'omega-time',partyId:'sup-time',weight:2000,price:24000,time:'08:00'},'buy-time');
 const sell=E('sale','2026-10-05',{productId:'omega-time',weight:1000,price:30000,channel:'offline',time:'09:00'},'sell-time');
 const r=replay([pp,ss,sell,buy]);
 assert.equal(r.stock['omega-time'],1000);
});
test('stok opname tertaut kulak lama tetap FIFO sebelum kulak baru',()=>{
 const pp=E('product','2026-10-04',{name:'OMEGA'},'omega-fifo');
 const ss=E('contact','2026-10-04',{name:'Supplier Lama',kind:'supplier'},'sup-old');
 const buyOld=E('purchase','2026-10-04',{productId:'omega-fifo',partyId:'sup-old',weight:20000,price:24000,time:'08:00'},'buy-old');
 const sellOld=E('sale','2026-10-04',{productId:'omega-fifo',weight:20000,price:30000,channel:'offline',time:'09:00'},'sell-old');
 const adjust=E('adjust','2026-10-05',{productId:'omega-fifo',actual:1450,price:0,sourcePurchaseId:'buy-old',time:'08:00'},'adj-old');
 const sell1=E('sale','2026-10-05',{productId:'omega-fifo',weight:1000,price:30000,channel:'offline',time:'09:00'},'sell-1');
 const buyNew=E('purchase','2026-10-05',{productId:'omega-fifo',partyId:'sup-old',weight:20000,price:24500,time:'10:00'},'buy-new');
 const sell2=E('sale','2026-10-05',{productId:'omega-fifo',weight:2000,price:30000,channel:'offline',time:'11:00'},'sell-2');
 const r=replay([pp,ss,buyOld,sellOld,adjust,sell1,buyNew,sell2]);
 assert.equal(r.stock['omega-fifo'],18450);
 const fifo=r.outcomes['sell-2'].itemBreakdown[0].fifo;
 assert.equal(fifo[0].source,'adj-old');assert.equal(fifo[0].qty,450);assert.equal(fifo[0].sourcePurchaseId,'buy-old');
 assert.equal(fifo[1].source,'buy-new');assert.equal(fifo[1].qty,1550);
});
test('stok opname tidak boleh menautkan kulak yang terjadi sesudahnya',()=>{
 const pp=E('product','2026-10-05',{name:'OMEGA'},'omega-invalid');
 const ss=E('contact','2026-10-05',{name:'Supplier B',kind:'supplier'},'sup-invalid');
 const adjust=E('adjust','2026-10-05',{productId:'omega-invalid',actual:1000,price:0,sourcePurchaseId:'buy-later',time:'08:00'},'adj-invalid');
 const buyLater=E('purchase','2026-10-05',{productId:'omega-invalid',partyId:'sup-invalid',weight:20000,price:24000,time:'10:00'},'buy-later');
 assert.throws(()=>replay([pp,ss,adjust,buyLater]),/Sumber kulak harus terjadi sebelum stok opname/);
});
console.log('TOTAL REVISI 1 '+tests+' pengujian lulus');
test('stok opname kurang tertaut batch mengurangi lot kulak yang dipilih',()=>{
 const pp=E('product','2026-10-10',{name:'OMEGA'},'omega-batch-loss');
 const ss=E('contact','2026-10-10',{name:'Supplier X',kind:'supplier'},'sup-batch-loss');
 const b1=E('purchase','2026-10-10',{productId:'omega-batch-loss',partyId:'sup-batch-loss',weight:5000,price:20000,time:'08:00'},'batch-loss-1');
 const b2=E('purchase','2026-10-10',{productId:'omega-batch-loss',partyId:'sup-batch-loss',weight:5000,price:30000,time:'09:00'},'batch-loss-2');
 const adj=E('adjust','2026-10-10',{productId:'omega-batch-loss',actual:9000,price:0,sourcePurchaseId:'batch-loss-2',time:'10:00'},'batch-loss-adj');
 const r=replay([pp,ss,b1,b2,adj]);
 assert.equal(r.stock['omega-batch-loss'],9000);
 assert.equal(r.outcomes['batch-loss-adj'].adjustQty,-1000);
 assert.equal(r.outcomes['batch-loss-adj'].fifo[0].sourcePurchaseId,'batch-loss-2');
 assert.equal(r.outcomes['batch-loss-adj'].cogs,30000);
 const remain1=r.products['omega-batch-loss'].lots.filter(x=>x.sourcePurchaseId==='batch-loss-1').reduce((n,x)=>n+x.qty,0);
 const remain2=r.products['omega-batch-loss'].lots.filter(x=>x.sourcePurchaseId==='batch-loss-2').reduce((n,x)=>n+x.qty,0);
 assert.equal(remain1,5000);assert.equal(remain2,4000);
});
test('retur supplier menyimpan sumber FIFO untuk laporan batch',()=>{
 const pp=E('product','2026-10-11',{name:'HORN'},'horn-ret-batch');
 const ss=E('contact','2026-10-11',{name:'Supplier R',kind:'supplier'},'sup-ret-batch');
 const b=E('purchase','2026-10-11',{productId:'horn-ret-batch',partyId:'sup-ret-batch',weight:3000,price:22000,time:'08:00'},'buy-ret-batch');
 const ret=E('return','2026-10-11',{direction:'supplier',partyId:'sup-ret-batch',productId:'horn-ret-batch',weight:500,resolution:'none',time:'09:00'},'ret-batch');
 const r=replay([pp,ss,b,ret]);
 assert.equal(r.outcomes['ret-batch'].fifo[0].sourcePurchaseId,'buy-ret-batch');
 assert.equal(r.outcomes['ret-batch'].cogs,11000);
});
console.log('TOTAL LAPORAN BATCH '+tests+' pengujian lulus');

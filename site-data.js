export const defaults = {
 name:'Cangkang Mas', slogan:'Telur Fresh, Siap Angkut!', copyright:'© 2026 Cangkang Mas',
 nav:['Beranda','Produk','Galeri','Profil','Kontak'], loginLabel:'Login',
 heroEyebrow:'SELAMAT DATANG DI CANGKANG MAS', heroTitle:'Telur Fresh, Siap Angkut!',
 heroText:'Pilihan telur segar untuk kebutuhan rumah tangga, toko, dan usaha kuliner. Melayani pembelian eceran dan grosir.',
 heroImage:'', logoImage:'', profileImage:'',
 homeProductTitle:'Pilihan Telur Cangkang Mas',homeProductIntro:'Kenali pilihan telur kami dan lihat informasi lengkap pada halaman Produk.',
 productTitle:'Produk & Harga Telur', productIntro:'Informasi harga eceran dan grosir per kilogram.',
 productNote:'Harga dapat berubah mengikuti kondisi pasar. Hubungi kami untuk informasi lebih lanjut.',
 galleryTitle:'Galeri Cangkang Mas',galleryIntro:'Foto produk dan aktivitas usaha kami.',
 profileTitle:'Mengenal Cangkang Mas', profileText:'Cangkang Mas merupakan agen telur di Surabaya yang melayani kebutuhan rumah tangga, toko, dan usaha kuliner.',
 profileHighlightTitle:'Telur Fresh, Siap Angkut!', profileHighlightText:'Informasi produk, harga terbaru, dan layanan usaha dapat Anda tanyakan melalui WhatsApp.',
 serviceTitle:'Layanan Kami', services:[{title:'Pilihan Telur',text:'HORN dan OMEGA'},{title:'Eceran & Grosir',text:'Rumah tangga dan usaha'},{title:'Informasi Produk',text:'Tanyakan melalui WhatsApp'},{title:'Informasi Pengiriman',text:'Konfirmasi wilayah layanan'}],
 contactTitle:'Hubungi Kami', contactIntro:'Silakan pilih nomor WhatsApp untuk informasi produk dan layanan.',
 locationTitle:'Lokasi Usaha', address:'', region:'Surabaya Selatan dan sekitarnya', hours:'', mapsUrl:'', contacts:[],
 buttons:{whatsapp:'Hubungi WhatsApp',products:'Lihat Produk',productAsk:'Tanya',share:'Bagikan',maps:'Buka Google Maps'},
 seo:{beranda:{title:'Cangkang Mas | Agen Telur Eceran & Grosir Surabaya',description:'Cangkang Mas, agen telur di Surabaya. Menyediakan telur HORN dan OMEGA untuk rumah tangga, toko dan usaha kuliner. Melayani eceran dan grosir.',index:true},produk:{title:'Jual Telur HORN & OMEGA di Surabaya | Cangkang Mas',description:'Lihat produk telur HORN dan OMEGA di Cangkang Mas, agen telur eceran dan grosir di Surabaya.',index:true},galeri:{title:'Galeri Produk Telur | Cangkang Mas Surabaya',description:'Foto produk dan kegiatan agen telur Cangkang Mas di Surabaya.',index:true},profil:{title:'Profil Cangkang Mas | Agen Telur Surabaya',description:'Tentang Cangkang Mas, agen telur eceran dan grosir di Surabaya.',index:true},kontak:{title:'Kontak Agen Telur Cangkang Mas Surabaya',description:'Hubungi Cangkang Mas, agen telur di Surabaya. Informasi WhatsApp, layanan, dan lokasi usaha.',index:true}}
};
export const defaultProducts=[
 {id:'horn',name:'Telur HORN',description:'Telur ayam untuk kebutuhan rumah tangga, toko, dan usaha kuliner.',retail:null,wholesale:null,minWholesale:10,showMin:true,status:'available',visible:true,position:1,image:'',seoTitle:'Telur HORN Eceran & Grosir Surabaya | Cangkang Mas',seoDescription:'Informasi telur HORN eceran dan grosir dari agen telur Cangkang Mas Surabaya.'},
 {id:'omega',name:'Telur OMEGA',description:'Pilihan telur OMEGA untuk kebutuhan konsumsi sehari-hari.',retail:null,wholesale:null,minWholesale:null,showMin:false,status:'available',visible:true,position:2,image:'',seoTitle:'Telur OMEGA Eceran & Grosir Surabaya | Cangkang Mas',seoDescription:'Informasi telur OMEGA eceran dan grosir dari Cangkang Mas Surabaya.'}
];
export function safeUrl(s){try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
export function waLink(phone,message){const n=String(phone||'').replace(/\D/g,'');return n?`https://wa.me/${n}?text=${encodeURIComponent(message)}`:''}
export const money=n=>Number.isFinite(Number(n))&&n!==null&&n!==''?'Rp'+Math.round(Number(n)).toLocaleString('id-ID'):'Hubungi kami';

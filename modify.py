from pathlib import Path
p=Path('/mnt/data/cm_work/public.js'); s=p.read_text()
def replace_function(name, content):
 global s
 start=s.index('function '+name+'(')
 end=s.index('\nfunction ',start+9)
 s=s[:start]+content+'\n'+s[end+1:]
replace_function('card', '''function card(p,compact=false){
 const out=p.status==='out',l=primaryLink(p.name),productUrl=urlProduct(p);
 return `<article class="card${compact?' compact-card':''}">
 ${image(['horn','omega'].includes(p.id)?localImage(p.id+'.png'):maybeImage(p.image),p.name)}
 <div class="card-body"><div class="card-main"><div class="card-heading"><h3>${esc(p.name)}</h3>${compact?'':`<span class="badge ${out?'out':''}">${out?'Habis':'Tersedia'}</span>`}</div><p class="card-description">${esc(p.description)}</p></div>
 ${compact?`<a class="btn btn-dark card-cta" href="${productUrl}">Lihat Detail →</a>`:
 `<div class="prices"><div class="price wholesale"><small>HARGA GROSIR</small><strong>${money(p.wholesale)}</strong><small>per kg</small></div><div class="price retail"><small>HARGA ECERAN</small><strong>${money(p.retail)}</strong><small>per kg</small></div></div>
 ${p.showMin&&p.minWholesale?`<p class="muted">Minimum grosir: ${esc(p.minWholesale)} kg</p>`:''}
 ${out?'<p class="notice">Stok sedang tidak tersedia. Hubungi kami untuk menanyakan ketersediaan.</p>':''}
 <div class="buttons card-actions">${linkButton(out?'Tanya Ketersediaan':(cfg.buttons?.productAsk||'Tanya')+' '+p.name,l)}<a class="btn btn-light share" href="${productUrl}" data-share="${esc(productUrl)}" aria-label="Bagikan ${esc(p.name)}">↗ ${esc(cfg.buttons?.share||'Bagikan')}</a></div><a class="product-detail-link" href="${productUrl}">Lihat detail ${esc(p.name)} →</a>`}
 </div></article>`;
}''')
replace_function('home', '''function home(){
 const intro=products.filter(x=>x.visible!==false).slice(0,4),photos=visibleGallery();
 const preview=photos.length?photos:localGallery.map((_,i)=>({title:['Kemasan','Siap Kirim','Sesuai Prosedur','Sesuai Prosedur','Siap Angkut','Siap Angkut'][i],visible:true}));
 const galleryMarkup=preview.map((g,i)=>`<a class="home-gallery-item" href="${href('galeri/')}" aria-label="Lihat Galeri: ${esc(g.title)}"><span class="home-gallery-photo">${image(i<localGallery.length?localImage(localGallery[i]):maybeImage(g.image),g.title,'gallery-thumb')}</span><b>${esc(g.title)}</b></a>`).join('');
 const serviceIcons=[`<path d="M12 3C8 3 6 9 6 14a6 6 0 0 0 12 0c0-5-2-11-6-11Z"/>`,`<path d="M3 8h18l-2 12H5L3 8Zm4 0 5-6 5 6M8 12v4m4-4v4m4-4v4"/>`,`<path d="M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5"/>`,`<path d="M2 6h12v11H2zM14 10h4l4 4v3h-8zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>`];
 return `<section class="hero"><div class="hero-layout wrap">${image(localImage('beranda.jpg'),'Foto utama Cangkang Mas','hero-picture')}<div class="hero-copy"><span class="eyebrow">${esc(cfg.heroEyebrow)}</span><h1>${esc(cfg.heroTitle)}</h1><p>${esc(cfg.heroText)}</p><div class="buttons">${linkButton(cfg.buttons?.whatsapp||'Hubungi WhatsApp',primaryLink())}<a href="${href('produk/')}" class="btn btn-outline">${esc(cfg.buttons?.products||'Lihat Produk')} →</a></div></div></div></section>
 <main><section class="home-gallery wrap" aria-label="Galeri pilihan"><div class="home-gallery-heading"><h2>${esc(cfg.galleryTitle||'Galeri Kami')}</h2><a href="${href('galeri/')}">Lihat Semua →</a></div><div class="home-gallery-slider"><button class="home-gallery-arrow" type="button" data-slide="prev" aria-label="Foto galeri sebelumnya">‹</button><div class="home-gallery-items">${galleryMarkup}</div><button class="home-gallery-arrow" type="button" data-slide="next" aria-label="Foto galeri berikutnya">›</button></div></section>
 <section class="section services-section"><div class="wrap"><div class="intro"><h2>${esc(cfg.serviceTitle)}</h2></div><div class="service-grid">${(cfg.services||[]).map((item,i)=>`<div class="service"><span class="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${serviceIcons[i%serviceIcons.length]}</svg></span><b>${esc(item.title)}</b><p>${esc(item.text)}</p></div>`).join('')}</div></div></section>
 <section class="section wrap products-section"><div class="intro"><span class="overline">PRODUK KAMI</span><h2>${esc(cfg.homeProductTitle)}</h2><p>${esc(cfg.homeProductIntro)}</p></div><div class="grid">${intro.map(p=>card(p,true)).join('')||'<p>Produk segera tersedia.</p>'}</div></section>
 <section class="section purchase-section"><div class="wrap"><div class="intro"><h2>Eceran &amp; Grosir</h2></div><div class="purchase-grid"><div class="purchase-card"><span class="purchase-icon" aria-hidden="true">⌂</span><div><h3>Pembelian Eceran</h3><p>Untuk kebutuhan rumah tangga dan pembelian harian dalam jumlah kecil.</p></div></div><div class="purchase-card"><span class="purchase-icon" aria-hidden="true">▣</span><div><h3>Pembelian Grosir</h3><p>Untuk toko, usaha kuliner, dan kebutuhan pembelian dalam jumlah besar.</p></div></div></div></div></section></main>`;
}''')
replace_function('contactPage', '''function contactPage(){
 const all=(cfg.contacts||[]).filter(c=>c.active!==false&&c.number),sorted=[...all].sort((a,b)=>Number(!!b.primary)-Number(!!a.primary)),embed=locationEmbed();
 return `<main class="contact-page"><section class="contact-hero"><div class="wrap"><span class="eyebrow">KONTAK CANGKANG MAS</span><h1>${esc(cfg.contactTitle)}</h1><p>${esc(cfg.contactIntro)}</p></div></section><div class="contact-area"><div class="wrap"><div class="contact-list">${sorted.map(c=>`<div class="info contact-card"><div class="contact-icon">${waIcon()}</div><div class="contact-main"><h3>${esc(c.name)} ${c.primary?'<span class="badge">Prioritas</span>':''}</h3><p>Informasi produk, harga, stok, dan pemesanan melalui WhatsApp.</p>${linkButton('Chat WhatsApp',waLink(c.number,`Halo ${cfg.name}, saya ingin menanyakan informasi telur.`))}</div></div>`).join('')||'<p>Nomor WhatsApp belum tersedia.</p>'}</div><section class="location-card"><div class="location-head"><h2>${esc(cfg.locationTitle)}</h2><p>Informasi lokasi dan layanan Cangkang Mas.</p></div><div class="location-details"><div class="location-detail"><span aria-hidden="true">⌖</span><div><b>Lokasi Usaha</b><p>${esc(cfg.address||'Alamat belum dicantumkan.')}</p></div></div><div class="location-detail"><span aria-hidden="true">◎</span><div><b>Wilayah Layanan</b><p>${esc(cfg.region)}</p></div></div><div class="location-detail"><span aria-hidden="true">◷</span><div><b>Jam Operasional</b><p>${esc(cfg.hours||'Hubungi kami untuk informasi jam operasional.')}</p></div></div></div>${embed?`<iframe class="map" title="Peta lokasi Cangkang Mas" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${esc(embed)}"></iframe>`:'<div class="notice">Isi alamat lengkap atau URL embed Google Maps melalui pengaturan Kontak agar pratinjau peta muncul di sini.</div>'}</section></div></div></main>`;
}''')
# preserve gallery page and other routes verbatim; add functional home preview carousel init
needle=" root.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>openGallery(Number(b.dataset.gallery))));}"
assert needle in s
s=s.replace(needle,""" const slides=[...root.querySelectorAll('.home-gallery-item')];let slideIndex=0;
 const drawSlides=()=>{const all=window.matchMedia('(min-width:781px)').matches;const shown=Math.min(3,slides.length);if(slideIndex>Math.max(0,slides.length-shown))slideIndex=0;slides.forEach((el,i)=>{el.hidden=!all&&(i<slideIndex||i>=slideIndex+shown)})};
 root.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>{const max=Math.max(0,slides.length-3);slideIndex=b.dataset.slide==='next'?(slideIndex>=max?0:slideIndex+1):(slideIndex<=0?max:slideIndex-1);drawSlides()}));
 if(slides.length){drawSlides();window.addEventListener('resize',drawSlides,{passive:true,once:true})}
 root.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>openGallery(Number(b.dataset.gallery))));}""")
p.write_text(s)

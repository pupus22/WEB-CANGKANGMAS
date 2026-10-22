const text = value => String(value ?? '').trim();
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const jsonForHtml = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
export function productPath(id) {
  return ['horn', 'omega'].includes(id) ? `produk/${id}/` : `produk/?item=${encodeURIComponent(id)}`;
}
function absolute(value, base) {
  if (!value) return '';
  try { const u = new URL(value, base); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
}
export function pageSeo({config, products = [], page, productId = '', base = 'https://cangkangmas.id/', imageSource, live = false, missing = false}) {
  const cfg = config, name = text(cfg.name) || 'Cangkang Mas';
  const key = page === 'detail' ? 'produk' : page;
  const setting = cfg.seo?.[key] || {};
  const p = page === 'detail' ? products.find(p => p.id === productId && p.visible !== false) : null;
  const route = page === 'detail' ? productPath(productId) : page === 'beranda' ? '' : `${page}/`;
  const url = new URL(route, base).href;
  const title = missing ? `Produk tidak ditemukan | ${name}` : p ? text(p.seoTitle) || `${p.name} Eceran & Grosir Surabaya | ${name}` : text(setting.title) || name;
  const description = missing ? 'Produk ini tidak tersedia. Lihat pilihan produk pada katalog.' : p ? text(p.seoDescription) || text(p.description) : text(setting.description);
  const rawImage = p ? imageSource(p.image, `product:${p.id}`) : imageSource(cfg.heroImage, 'hero') || imageSource(cfg.logoImage, 'logo');
  const image = absolute(rawImage, base);
  const business = {'@type':'LocalBusiness', '@id':new URL('#usaha', base).href, name, url:base, description:text(cfg.profileText), areaServed:text(cfg.region)};
  if (text(cfg.address)) business.address = text(cfg.address);
  const phone = cfg.contacts?.find(c => c.primary && c.active !== false && c.number);
  if (phone) business.telephone = '+' + text(phone.number).replace(/\D/g, '').replace(/^0/, '62');
  const logo = absolute(imageSource(cfg.logoImage, 'logo'), base);
  if (logo) business.logo = logo;
  if (image) business.image = image;
  // Only publish openingHours when the saved text already uses Schema.org's format.
  if (/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))? \d{2}:\d{2}-\d{2}:\d{2}$/.test(text(cfg.hours))) business.openingHours = text(cfg.hours);
  const graph = [business, {'@type':'WebSite','@id':new URL('#website', base).href,url:base,name,inLanguage:'id-ID'}];
  if (p && !missing) {
    const product = {'@type':'Product','@id':url+'#produk',name:text(p.name),description:text(p.description),url,brand:{'@type':'Brand',name}};
    if (image) product.image = [image];
    // Static output omits offers; prices and availability come from the live public data.
    if (live && p.retail !== null && p.retail !== '' && Number.isFinite(Number(p.retail)) && Number(p.retail) > 0) {
      product.offers = {'@type':'Offer',url,priceCurrency:'IDR',price:Number(p.retail),availability:p.status === 'out' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',seller:{'@id':business['@id']},priceSpecification:{'@type':'UnitPriceSpecification',priceCurrency:'IDR',price:Number(p.retail),referenceQuantity:{'@type':'QuantitativeValue',value:1,unitCode:'KGM'}}};
    }
    graph.push(product, {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Beranda',item:base},{'@type':'ListItem',position:2,name:'Produk',item:new URL('produk/',base).href},{'@type':'ListItem',position:3,name:text(p.name),item:url}]});
  }
  return {title,description,url,image,imageAlt:p ? text(p.name) : name,robots:setting.index === false || missing ? 'noindex,follow' : 'index,follow',schema:{'@context':'https://schema.org','@graph':graph}};
}
export function seoHead(meta) {
  const attr = escapeHtml;
  return `<title>${attr(meta.title)}</title>\n<meta name="description" content="${attr(meta.description)}">\n<link rel="canonical" href="${attr(meta.url)}">\n<meta name="robots" content="${meta.robots}">\n<meta property="og:type" content="website">\n<meta property="og:locale" content="id_ID">\n<meta property="og:title" content="${attr(meta.title)}">\n<meta property="og:description" content="${attr(meta.description)}">\n<meta property="og:url" content="${attr(meta.url)}">\n${meta.image ? `<meta property="og:image" content="${attr(meta.image)}"><meta property="og:image:alt" content="${attr(meta.imageAlt)}">` : ''}\n<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}">\n<meta name="twitter:title" content="${attr(meta.title)}">\n<meta name="twitter:description" content="${attr(meta.description)}">\n${meta.image ? `<meta name="twitter:image" content="${attr(meta.image)}">` : ''}\n<script id="public-schema" type="application/ld+json">${jsonForHtml(meta.schema)}</script>`;
}
export function applySeo(document, meta) {
  document.title = meta.title;
  function set(selector, tag, attrs) {
    let node = document.querySelector(selector);
    if (!node) { node = document.createElement(tag); document.head.append(node); }
    for (const [key,value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }
  set('link[rel="canonical"]','link',{rel:'canonical',href:meta.url});
  for (const [name,content] of Object.entries({description:meta.description,robots:meta.robots,'twitter:card':meta.image?'summary_large_image':'summary','twitter:title':meta.title,'twitter:description':meta.description})) set(`meta[name="${name}"]`,'meta',{name,content});
  for (const [property,content] of Object.entries({'og:type':'website','og:locale':'id_ID','og:title':meta.title,'og:description':meta.description,'og:url':meta.url})) set(`meta[property="${property}"]`,'meta',{property,content});
  if (meta.image) {
    set('meta[property="og:image"]','meta',{property:'og:image',content:meta.image});
    set('meta[property="og:image:alt"]','meta',{property:'og:image:alt',content:meta.imageAlt});
    set('meta[name="twitter:image"]','meta',{name:'twitter:image',content:meta.image});
  } else document.querySelectorAll('meta[property="og:image"],meta[property="og:image:alt"],meta[name="twitter:image"]').forEach(n=>n.remove());
  document.querySelectorAll('script[type="application/ld+json"]:not(#public-schema)').forEach(n=>n.remove());
  set('#public-schema','script',{id:'public-schema',type:'application/ld+json'}).textContent = jsonForHtml(meta.schema);
}

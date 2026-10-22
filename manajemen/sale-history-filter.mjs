// Read-only selection: preserve event order and never modify transactions.
export function filterSaleHistory(events, filters = {}, contacts = {}, products = {}) {
  const terms = String(filters.query || '').trim().toLocaleLowerCase('id').split(/\s+/).filter(Boolean);
  if (filters.from && filters.to && filters.from > filters.to) return [];
  return events.filter(event => {
    if (event.type !== 'sale' || event.voided) return false;
    const data = event.data || {};
    const items = Array.isArray(data.items) && data.items.length ? data.items : [{productId: data.productId}];
    if (filters.from && (!event.date || event.date < filters.from)) return false;
    if (filters.to && (!event.date || event.date > filters.to)) return false;
    if (filters.channel && filters.channel !== 'all' && (data.channel || 'offline') !== filters.channel) return false;
    if (filters.product && !items.some(item => item.productId === filters.product)) return false;
    const searchable = [event.id, contacts[data.partyId]?.name || 'Pembeli umum', data.note,
      data.channel || 'offline', ...items.map(item => products[item.productId]?.name || '')]
      .join(' ').toLocaleLowerCase('id');
    return terms.every(term => searchable.includes(term));
  });
}

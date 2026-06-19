export function parsePrice(price) {
  if (typeof price === 'number') return price
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function toCartProduct(item, options = {}) {
  const id = item.id || slugify(item.name)
  return {
    id,
    name: item.name,
    price: parsePrice(item.price),
    image: item.image,
    detail: options.detail || item.detail || '1 pc • Fresh',
    qty: options.qty || 1,
  }
}

export function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

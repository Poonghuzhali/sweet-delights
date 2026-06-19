const KEYS = {
  users: 'sweet-delights-users',
  session: 'sweet-delights-session',
  orders: 'sweet-delights-orders',
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.users) || '[]')
  } catch {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(KEYS.users, JSON.stringify(users))
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.session) || 'null')
  } catch {
    return null
  }
}

export function saveSession(session) {
  if (session) {
    localStorage.setItem(KEYS.session, JSON.stringify(session))
  } else {
    localStorage.removeItem(KEYS.session)
  }
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.orders) || '[]')
  } catch {
    return []
  }
}

export function saveOrders(orders) {
  localStorage.setItem(KEYS.orders, JSON.stringify(orders))
}

export function generateId(prefix = 'SD') {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export const ORDER_STEPS = [
  'Order Placed',
  'Confirmed',
  'Baking',
  'Out for Delivery',
  'Delivered',
]

export function buildTrackingTimeline(statusIndex) {
  const now = new Date().toISOString()
  return ORDER_STEPS.map((step, index) => ({
    step,
    done: index <= statusIndex,
    active: index === statusIndex,
    time: index <= statusIndex ? now : null,
  }))
}

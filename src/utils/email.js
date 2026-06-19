import emailjs from '@emailjs/browser'
import { formatPrice } from './cart'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

export function isEmailConfigured() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)
}

function buildItemsText(items) {
  return items
    .map(
      (item) =>
        `${item.name} x ${item.qty} - ${formatPrice(item.price * item.qty)}`
    )
    .join('\n')
}

function formatPayment(payment) {
  if (!payment) return 'Not specified'
  if (payment.method === 'online') {
    return payment.cardLast4
      ? `Paid Online (Card ending ${payment.cardLast4})`
      : 'Paid Online'
  }
  return 'Cash on Delivery'
}

export async function sendOrderConfirmation(order, user) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'not_configured' }
  }

  const customerEmail = user?.email
  if (!customerEmail) {
    return { sent: false, reason: 'no_email' }
  }

  const delivery = order.delivery || {}
  const customerName =
    `${delivery.firstName || ''} ${delivery.lastName || ''}`.trim() ||
    user.fullName ||
    'Customer'

  const templateParams = {
    to_email: customerEmail,
    to_name: customerName,
    order_id: order.id,
    tracking_id: order.trackingId,
    order_date: new Date(order.createdAt).toLocaleString('en-IN'),
    order_items: buildItemsText(order.items),
    subtotal: formatPrice(order.subtotal),
    delivery_fee: formatPrice(order.deliveryFee),
    taxes: formatPrice(order.taxes),
    order_total: formatPrice(order.total),
    payment_method: formatPayment(order.payment),
    delivery_address: delivery.address || '',
    delivery_date: delivery.date || '',
    delivery_time: delivery.time || '',
    customer_phone: delivery.phone || user.phone || '',
    cake_message: delivery.message || '-',
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    })
    return { sent: true }
  } catch (error) {
    return { sent: false, reason: 'send_failed', error }
  }
}

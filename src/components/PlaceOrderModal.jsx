import { useEffect } from 'react'
import { CloseIcon } from '../icons'

export default function PlaceOrderModal({
  open,
  onClose,
  customerName,
  trackingId,
  orderId,
}) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="place-order-overlay" onClick={onClose}>
      <div
        className="place-order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-order-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="place-order-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon size={22} />
        </button>

        <div className="place-order-modal__inner">
          <h1 id="place-order-title">Order Placed!</h1>
          <p className="place-order__subtitle">
            {customerName ? `Thank you, ${customerName}! ` : ''}
            Your order has been placed successfully. Our bakery team will
            contact you shortly to confirm delivery details.
          </p>
          {trackingId && (
            <div className="order-confirm-details">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Tracking ID:</strong> {trackingId}
              </p>
            </div>
          )}
          <button
            type="button"
            className="btn btn--primary place-order__submit"
            onClick={onClose}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  )
}

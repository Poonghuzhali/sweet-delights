import { useEffect, useState } from 'react'
import { orderFlavours } from '../data'
import { CloseIcon } from '../icons'

const emptyForm = {
  fullName: '',
  phone: '',
  flavour: '',
  eventType: '',
  message: '',
}

export default function PlaceOrderModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(emptyForm)

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

  useEffect(() => {
    if (!open) {
      setSubmitted(false)
      setForm(emptyForm)
    }
  }, [open])

  if (!open) return null

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="place-order-overlay" onClick={handleClose}>
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
          onClick={handleClose}
          aria-label="Close"
        >
          <CloseIcon size={22} />
        </button>

        <div className="place-order-modal__inner">
          {submitted ? (
            <>
              <h1 id="place-order-title">Thank You!</h1>
              <p className="place-order__subtitle">
                Your order request has been submitted. Our bakery team will
                contact you shortly to confirm your order details.
              </p>
              <button
                type="button"
                className="btn btn--primary place-order__submit"
                onClick={handleClose}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <h1 id="place-order-title">Place Your Order</h1>
              <p className="place-order__subtitle">
                Fill out the form below and our bakery team will get back to you
                to confirm your order details.
              </p>

              <form className="place-order__form" onSubmit={handleSubmit}>
                <label>
                  Full Name
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Select Flavour
                  <select
                    name="flavour"
                    value={form.flavour}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a flavour
                    </option>
                    {orderFlavours.map((flavour) => (
                      <option key={flavour} value={flavour}>
                        {flavour}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Event Type
                  <input
                    type="text"
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Special Instructions / Message
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn--primary place-order__submit"
                >
                  Submit Order Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

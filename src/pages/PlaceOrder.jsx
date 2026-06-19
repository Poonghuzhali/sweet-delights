import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderFlavours } from '../data'

export default function PlaceOrder() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    flavour: '',
    eventType: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="place-order">
        <div className="place-order__inner">
          <h1>Thank You!</h1>
          <p>
            Your order request has been submitted. Our bakery team will contact
            you shortly to confirm your order details.
          </p>
          <button
            type="button"
            className="btn btn--primary place-order__submit"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="place-order">
      <div className="place-order__inner">
        <h1>Place Your Order</h1>
        <p className="place-order__subtitle">
          Fill out the form below and our bakery team will get back to you to
          confirm your order details.
        </p>

        <form className="place-order__form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              placeholder=""
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
              placeholder=""
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
              placeholder=""
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
              placeholder=""
              value={form.message}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="btn btn--primary place-order__submit">
            Submit Order Request
          </button>
        </form>
      </div>
    </section>
  )
}

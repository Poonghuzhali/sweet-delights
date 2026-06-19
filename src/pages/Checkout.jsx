import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  checkoutItems as defaultItems,
  upsellItems,
  deliveryFee,
  taxRate,
} from '../data'
import {
  CalendarIcon,
  ClockIcon,
  CardIcon,
  WalletIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
} from '../icons'

function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function Checkout() {
  const navigate = useNavigate()
  const [items, setItems] = useState(defaultItems)
  const [addedUpsells, setAddedUpsells] = useState([])
  const [payment, setPayment] = useState('online')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    message: '',
  })

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    )
  }

  const toggleUpsell = (id) => {
    setAddedUpsells((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const subtotal = useMemo(() => {
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const upsellTotal = upsellItems
      .filter((u) => addedUpsells.includes(u.id))
      .reduce((sum, u) => sum + u.price, 0)
    return cartTotal + upsellTotal
  }, [items, addedUpsells])

  const taxes = Math.round(subtotal * taxRate)
  const total = subtotal + deliveryFee + taxes

  return (
    <section className="checkout section section--pink-soft">
      <div className="container checkout__layout">
        <div className="checkout__main">
          <h1 className="checkout__title">Complete Your Checkout</h1>

          {/* Section 1 */}
          <div className="checkout-section">
            <div className="checkout-section__head">
              <span className="checkout-step">1</span>
              <h2>Review Your Order</h2>
            </div>

            <div className="checkout-items">
              {items.map((item) => (
                <article className="checkout-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item__info">
                    <h3>{item.name}</h3>
                    <span className="checkout-item__detail">{item.detail}</span>
                    <span className="checkout-item__price">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <div className="qty-control">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(item.id, -1)}
                    >
                      <MinusIcon />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.id, 1)}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="upsell">
              <h3>Frequently bought together</h3>
              <div className="upsell__grid">
                {upsellItems.map((item) => {
                  const isAdded = addedUpsells.includes(item.id)
                  return (
                    <div className="upsell-card" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                      <button
                        type="button"
                        className={`btn btn--small ${isAdded ? 'btn--added' : ''}`}
                        onClick={() => toggleUpsell(item.id)}
                      >
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="checkout-section">
            <div className="checkout-section__head">
              <span className="checkout-step">2</span>
              <h2>Delivery Information</h2>
            </div>

            <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <label>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                Complete Address
                <textarea
                  name="address"
                  placeholder="Complete Address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                />
              </label>
              <div className="form-row">
                <label className="input-icon">
                  Delivery Date
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                  <CalendarIcon />
                </label>
                <label className="input-icon">
                  Preferred Time
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                  <ClockIcon />
                </label>
              </div>
              <label>
                Message on Cake (Optional)
                <input
                  type="text"
                  name="message"
                  placeholder="Message on Cake (Optional)"
                  value={form.message}
                  onChange={handleChange}
                />
              </label>
            </form>
          </div>

          {/* Section 3 */}
          <div className="checkout-section">
            <div className="checkout-section__head">
              <span className="checkout-step">3</span>
              <h2>Payment Method</h2>
            </div>

            <div className="payment-options">
              <label
                className={`payment-option ${
                  payment === 'online' ? 'payment-option--active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={payment === 'online'}
                  onChange={() => setPayment('online')}
                />
                <div className="payment-option__content">
                  <strong>Pay Online</strong>
                  <span>Credit/Debit Card, UPI, Netbanking or Wallets</span>
                </div>
                <div className="payment-option__icons">
                  <CardIcon />
                  <WalletIcon />
                </div>
              </label>

              <label
                className={`payment-option ${
                  payment === 'cod' ? 'payment-option--active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                />
                <div className="payment-option__content">
                  <strong>Cash on Delivery</strong>
                  <span>Pay when you receive your order</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          <ul className="order-summary__lines">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} (x{item.qty})
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
            {upsellItems
              .filter((u) => addedUpsells.includes(u.id))
              .map((u) => (
                <li key={u.id}>
                  <span>{u.name}</span>
                  <span>{formatPrice(u.price)}</span>
                </li>
              ))}
            <li>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </li>
            <li>
              <span>Delivery Fee</span>
              <span>{formatPrice(deliveryFee)}</span>
            </li>
            <li>
              <span>Taxes</span>
              <span>{formatPrice(taxes)}</span>
            </li>
          </ul>
          <div className="order-summary__total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => navigate('/place-order')}
          >
            Place Order
          </button>
          <p className="order-summary__secure">
            <LockIcon /> 100% Secure Checkout
          </p>
        </aside>
      </div>
    </section>
  )
}

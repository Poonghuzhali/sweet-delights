import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { upsellItems, deliveryFee, taxRate } from '../data'
import PlaceOrderModal from '../components/PlaceOrderModal'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/cart'
import {
  formatCardNumber,
  getMinDeliveryDate,
  validateCheckoutForm,
} from '../utils/validation'
import {
  CalendarIcon,
  ClockIcon,
  CardIcon,
  WalletIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
} from '../icons'

function FieldError({ message }) {
  if (!message) return null
  return <span className="field-error">{message}</span>
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}

function CheckoutContent() {
  const { items, updateQty, toggleUpsell, isInCart, subtotal: cartSubtotal, clearCart } =
    useCart()
  const { user, placeOrder } = useAuth()
  const navigate = useNavigate()
  const [showPlaceOrder, setShowPlaceOrder] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [payment, setPayment] = useState('')
  const [errors, setErrors] = useState({})
  const [formTouched, setFormTouched] = useState(false)
  const deliveryRef = useRef(null)
  const paymentRef = useRef(null)
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    message: '',
  })

  useEffect(() => {
    if (!user) return
    const parts = user.fullName.trim().split(' ')
    setForm((prev) => ({
      ...prev,
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      phone: user.phone || prev.phone,
      address: user.address || prev.address,
    }))
  }, [user])

  const upsellProducts = upsellItems.filter((u) => isInCart(u.id))
  const mainItems = items.filter(
    (item) => !upsellItems.some((u) => u.id === item.id)
  )

  const subtotal = cartSubtotal
  const taxes = Math.round(subtotal * taxRate)
  const total = subtotal + (items.length > 0 ? deliveryFee : 0) + taxes

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)
    if (formTouched) {
      setErrors(validateCheckoutForm(updated, payment, cardForm))
    }
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    const nextValue =
      name === 'cardNumber'
        ? formatCardNumber(value)
        : name === 'expiryMonth' || name === 'expiryYear' || name === 'cvv'
          ? value.replace(/\D/g, '')
          : value
    const updated = { ...cardForm, [name]: nextValue }
    setCardForm(updated)
    if (formTouched) {
      setErrors(validateCheckoutForm(form, payment, updated))
    }
  }

  const handlePaymentChange = (value) => {
    setPayment(value)
    if (value !== 'online') {
      setCardForm({
        cardNumber: '',
        cardName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
      })
    }
    if (formTouched) {
      setErrors(
        validateCheckoutForm(form, value, value === 'online' ? cardForm : null)
      )
    }
  }

  const handlePlaceOrder = () => {
    setFormTouched(true)
    const validationErrors = validateCheckoutForm(form, payment, cardForm)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      const deliveryFields = [
        'firstName',
        'lastName',
        'phone',
        'address',
        'date',
        'time',
      ]
      const cardFields = [
        'cardNumber',
        'cardName',
        'expiryMonth',
        'expiryYear',
        'cvv',
      ]
      const hasDeliveryError = deliveryFields.some((key) => validationErrors[key])
      const hasCardError = cardFields.some((key) => validationErrors[key])
      if (hasDeliveryError) {
        deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (validationErrors.payment || hasCardError) {
        paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    const cardDigits = cardForm.cardNumber.replace(/\s/g, '')
    const result = placeOrder({
      items: items.map((item) => ({ ...item })),
      delivery: { ...form },
      payment:
        payment === 'online'
          ? { method: 'online', cardLast4: cardDigits.slice(-4) }
          : { method: 'cod' },
      subtotal,
      deliveryFee,
      taxes,
      total,
    })

    if (!result.success) return

    setPlacedOrder(result.order)
    clearCart()
    setShowPlaceOrder(true)
  }

  const handleModalClose = () => {
    setShowPlaceOrder(false)
    navigate('/account')
  }

  if (items.length === 0) {
    return (
      <section className="checkout section section--pink-soft">
        <div className="container checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add cakes and pastries from our menu to start your order.</p>
          <div className="checkout-empty__actions">
            <Link to="/cake" className="btn btn--primary">
              Browse Cakes
            </Link>
            <Link to="/pastries" className="btn btn--outline">
              Browse Pastries
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const customerName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim()

  return (
    <>
      <section className="checkout section section--pink-soft">
        <div className="container checkout__layout">
          <div className="checkout__main">
            <h1 className="checkout__title">Complete Your Checkout</h1>

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
                    const isAdded = isInCart(item.id)
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
                          onClick={() => toggleUpsell(item)}
                        >
                          {isAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="checkout-section" ref={deliveryRef}>
              <div className="checkout-section__head">
                <span className="checkout-step">2</span>
                <h2>Delivery Information</h2>
              </div>

              <form
                className="checkout-form"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  handlePlaceOrder()
                }}
              >
                <div className="form-row">
                  <label className={errors.firstName ? 'field-invalid' : ''}>
                    First Name *
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoComplete="given-name"
                    />
                    <FieldError message={errors.firstName} />
                  </label>
                  <label className={errors.lastName ? 'field-invalid' : ''}>
                    Last Name *
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      autoComplete="family-name"
                    />
                    <FieldError message={errors.lastName} />
                  </label>
                </div>
                <label className={errors.phone ? 'field-invalid' : ''}>
                  Phone Number *
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    maxLength={10}
                  />
                  <FieldError message={errors.phone} />
                </label>
                <label className={errors.address ? 'field-invalid' : ''}>
                  Complete Address *
                  <textarea
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House no., street, city, pincode"
                    autoComplete="street-address"
                  />
                  <FieldError message={errors.address} />
                </label>
                <div className="form-row">
                  <label
                    className={`input-icon ${errors.date ? 'field-invalid' : ''}`}
                  >
                    Delivery Date *
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      min={getMinDeliveryDate()}
                      onChange={handleChange}
                    />
                    <CalendarIcon />
                    <FieldError message={errors.date} />
                  </label>
                  <label
                    className={`input-icon ${errors.time ? 'field-invalid' : ''}`}
                  >
                    Preferred Time *
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                    />
                    <ClockIcon />
                    <FieldError message={errors.time} />
                  </label>
                </div>
                <label>
                  Message on Cake (Optional)
                  <input
                    type="text"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message on Cake (Optional)"
                  />
                </label>
              </form>
            </div>

            <div className="checkout-section" ref={paymentRef}>
              <div className="checkout-section__head">
                <span className="checkout-step">3</span>
                <h2>Payment Method</h2>
              </div>

              <div className="payment-options">
                <label
                  className={`payment-option ${
                    payment === 'online' ? 'payment-option--active' : ''
                  } ${errors.payment ? 'payment-option--error' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={payment === 'online'}
                    onChange={() => handlePaymentChange('online')}
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
                  } ${errors.payment ? 'payment-option--error' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === 'cod'}
                    onChange={() => handlePaymentChange('cod')}
                  />
                  <div className="payment-option__content">
                    <strong>Cash on Delivery</strong>
                    <span>Pay when you receive your order</span>
                  </div>
                </label>
              </div>
              <FieldError message={errors.payment} />

              {payment === 'online' && (
                <div className="card-payment-form checkout-form">
                  <p className="card-payment-form__title">Card Details</p>
                  <label className={errors.cardNumber ? 'field-invalid' : ''}>
                    Card Number *
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardForm.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={23}
                    />
                    <FieldError message={errors.cardNumber} />
                  </label>
                  <label className={errors.cardName ? 'field-invalid' : ''}>
                    Name on Card *
                    <input
                      type="text"
                      name="cardName"
                      value={cardForm.cardName}
                      onChange={handleCardChange}
                      placeholder="As printed on card"
                      autoComplete="cc-name"
                    />
                    <FieldError message={errors.cardName} />
                  </label>
                  <div className="form-row form-row--card">
                    <label className={errors.expiryMonth ? 'field-invalid' : ''}>
                      Expiry Month *
                      <input
                        type="text"
                        name="expiryMonth"
                        value={cardForm.expiryMonth}
                        onChange={handleCardChange}
                        placeholder="MM"
                        inputMode="numeric"
                        autoComplete="cc-exp-month"
                        maxLength={2}
                      />
                      <FieldError message={errors.expiryMonth} />
                    </label>
                    <label className={errors.expiryYear ? 'field-invalid' : ''}>
                      Expiry Year *
                      <input
                        type="text"
                        name="expiryYear"
                        value={cardForm.expiryYear}
                        onChange={handleCardChange}
                        placeholder="YY"
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        maxLength={2}
                      />
                      <FieldError message={errors.expiryYear} />
                    </label>
                    <label className={errors.cvv ? 'field-invalid' : ''}>
                      CVV *
                      <input
                        type="password"
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                      />
                      <FieldError message={errors.cvv} />
                    </label>
                  </div>
                  <p className="card-payment-form__note">
                    <LockIcon /> Your card details are validated securely and are
                    not stored.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="order-summary">
            <h2>Order Summary</h2>
            <ul className="order-summary__lines">
              {mainItems.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.name} (x{item.qty})
                  </span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
              {upsellProducts.map((u) => (
                <li key={u.id}>
                  <span>{u.name}</span>
                  <span>{formatPrice(u.price * u.qty)}</span>
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
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
            <p className="order-summary__hint">
              Complete delivery details, choose a payment method
              {payment === 'online' ? ', and fill in your card details' : ''} to
              place your order.
            </p>
            <p className="order-summary__secure">
              <LockIcon /> 100% Secure Checkout
            </p>
          </aside>
        </div>
      </section>

      <PlaceOrderModal
        open={showPlaceOrder}
        onClose={handleModalClose}
        customerName={customerName}
        trackingId={placedOrder?.trackingId}
        orderId={placedOrder?.id}
      />
    </>
  )
}

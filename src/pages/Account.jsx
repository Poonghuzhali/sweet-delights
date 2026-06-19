import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/cart'
import ProtectedRoute from '../components/ProtectedRoute'

function FieldError({ message }) {
  if (!message) return null
  return <span className="field-error">{message}</span>
}

function AccountContent() {
  const { user, orders, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '')
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErrors, setProfileErrors] = useState({})

  const selectedOrder =
    orders.find((o) => o.id === selectedOrderId) || orders[0]

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setProfileMsg('')
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    const errors = {}
    if (!profile.fullName.trim() || profile.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters'
    }
    if (!/^[6-9]\d{9}$/.test(profile.phone.trim())) {
      errors.phone = 'Enter a valid 10-digit mobile number'
    }
    setProfileErrors(errors)
    if (Object.keys(errors).length > 0) return

    updateProfile(profile)
    setProfileMsg('Profile updated successfully')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <section className="section section--pink-soft account-page">
      <div className="container">
        <div className="account-header">
          <div>
            <h1>My Account</h1>
            <p>Welcome back, {user.fullName.split(' ')[0]}!</p>
          </div>
          <button type="button" className="btn btn--outline" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="account-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === 'profile' ? 'auth-tab--active' : ''}`}
            onClick={() => setTab('profile')}
          >
            My Profile
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'orders' ? 'auth-tab--active' : ''}`}
            onClick={() => setTab('orders')}
          >
            Order History
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'tracking' ? 'auth-tab--active' : ''}`}
            onClick={() => setTab('tracking')}
          >
            Order Tracking
          </button>
        </div>

        {tab === 'profile' && (
          <div className="account-panel">
            <h2>Customer Information</h2>
            <div className="profile-info">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Member since:</strong>{' '}
                {new Date(user.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            <form className="auth-form" onSubmit={handleProfileSave}>
              <label className={profileErrors.fullName ? 'field-invalid' : ''}>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                />
                <FieldError message={profileErrors.fullName} />
              </label>
              <label className={profileErrors.phone ? 'field-invalid' : ''}>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  maxLength={10}
                />
                <FieldError message={profileErrors.phone} />
              </label>
              <label>
                Address
                <textarea
                  name="address"
                  rows={3}
                  value={profile.address}
                  onChange={handleProfileChange}
                />
              </label>
              {profileMsg && <p className="auth-success">{profileMsg}</p>}
              <button type="submit" className="btn btn--primary">
                Save Profile
              </button>
            </form>
          </div>
        )}

        {tab === 'orders' && (
          <div className="account-panel">
            <h2>Order History</h2>
            {orders.length === 0 ? (
              <div className="account-empty">
                <p>You have not placed any orders yet.</p>
                <Link to="/cake" className="btn btn--primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card__head">
                      <div>
                        <strong>Order #{order.id.slice(-8).toUpperCase()}</strong>
                        <span>Tracking: {order.trackingId}</span>
                      </div>
                      <span className="order-card__status">{order.status}</span>
                    </div>
                    <p className="order-card__date">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                    <ul className="order-card__items">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.id}`}>
                          {item.name} × {item.qty} —{' '}
                          {formatPrice(item.price * item.qty)}
                        </li>
                      ))}
                    </ul>
                    <div className="order-card__foot">
                      <span>{formatPrice(order.total)}</span>
                      <button
                        type="button"
                        className="btn btn--outline btn--small"
                        onClick={() => {
                          setSelectedOrderId(order.id)
                          setTab('tracking')
                        }}
                      >
                        Track Order
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'tracking' && (
          <div className="account-panel">
            <h2>Order Tracking</h2>
            {orders.length === 0 ? (
              <div className="account-empty">
                <p>No orders to track yet.</p>
              </div>
            ) : (
              <>
                <label className="tracking-select">
                  Select Order
                  <select
                    value={selectedOrder?.id || ''}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                  >
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.trackingId} — {order.status}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedOrder && (
                  <div className="tracking-panel">
                    <div className="tracking-panel__head">
                      <p>
                        <strong>Tracking ID:</strong> {selectedOrder.trackingId}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedOrder.status}
                      </p>
                      <p>
                        <strong>Delivery:</strong>{' '}
                        {selectedOrder.delivery.date} at{' '}
                        {selectedOrder.delivery.time}
                      </p>
                    </div>
                    <div className="tracking-timeline">
                      {selectedOrder.tracking.map((step, index) => (
                        <div
                          className={`tracking-step ${
                            step.done ? 'tracking-step--done' : ''
                          } ${step.active ? 'tracking-step--active' : ''}`}
                          key={step.step}
                        >
                          <span className="tracking-step__dot">{index + 1}</span>
                          <div>
                            <strong>{step.step}</strong>
                            {step.done && step.time && (
                              <span>
                                {new Date(step.time).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Account() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  )
}

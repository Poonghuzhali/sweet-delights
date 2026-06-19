import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateLogin, validateRegister } from '../utils/validation'

function FieldError({ message }) {
  if (!message) return null
  return <span className="field-error">{message}</span>
}

const emptyRegister = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
}

const emptyLogin = {
  email: '',
  password: '',
}

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/account'

  const [mode, setMode] = useState('login')
  const [registerForm, setRegisterForm] = useState(emptyRegister)
  const [loginForm, setLoginForm] = useState(emptyLogin)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const handleRegisterChange = (e) => {
    setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError('')
  }

  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError('')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const validationErrors = validateRegister(registerForm)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const result = register(registerForm)
    if (!result.success) {
      setFormError(result.error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const validationErrors = validateLogin(loginForm)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const result = login(loginForm.email, loginForm.password)
    if (!result.success) {
      setFormError(result.error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="section section--pink-soft auth-page">
      <div className="container auth-card">
        <h1>Welcome to Sweet Delights</h1>
        <p className="auth-card__subtitle">
          Login or create an account to place orders and track your deliveries.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => {
              setMode('login')
              setErrors({})
              setFormError('')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => {
              setMode('register')
              setErrors({})
              setFormError('')
            }}
          >
            Register
          </button>
        </div>

        {formError && <p className="auth-form-error">{formError}</p>}

        {mode === 'login' ? (
          <form className="auth-form" noValidate onSubmit={handleLogin}>
            <label className={errors.email ? 'field-invalid' : ''}>
              Email Address *
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <FieldError message={errors.email} />
            </label>
            <label className={errors.password ? 'field-invalid' : ''}>
              Password *
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <FieldError message={errors.password} />
            </label>
            <button type="submit" className="btn btn--primary btn--block">
              Login
            </button>
          </form>
        ) : (
          <form className="auth-form" noValidate onSubmit={handleRegister}>
            <label className={errors.fullName ? 'field-invalid' : ''}>
              Full Name *
              <input
                type="text"
                name="fullName"
                value={registerForm.fullName}
                onChange={handleRegisterChange}
                placeholder="Full Name"
                autoComplete="name"
              />
              <FieldError message={errors.fullName} />
            </label>
            <label className={errors.email ? 'field-invalid' : ''}>
              Email Address *
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <FieldError message={errors.email} />
            </label>
            <label className={errors.phone ? 'field-invalid' : ''}>
              Phone Number *
              <input
                type="tel"
                name="phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                placeholder="10-digit mobile number"
                maxLength={10}
                autoComplete="tel"
              />
              <FieldError message={errors.phone} />
            </label>
            <label className={errors.address ? 'field-invalid' : ''}>
              Address
              <textarea
                name="address"
                rows={2}
                value={registerForm.address}
                onChange={handleRegisterChange}
                placeholder="House no., street, city, pincode (optional)"
              />
              <FieldError message={errors.address} />
            </label>
            <div className="form-row">
              <label className={errors.password ? 'field-invalid' : ''}>
                Password *
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                />
                <FieldError message={errors.password} />
              </label>
              <label className={errors.confirmPassword ? 'field-invalid' : ''}>
                Confirm Password *
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
                <FieldError message={errors.confirmPassword} />
              </label>
            </div>
            <button type="submit" className="btn btn--primary btn--block">
              Create Account
            </button>
          </form>
        )}

        <p className="auth-card__footer">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </section>
  )
}

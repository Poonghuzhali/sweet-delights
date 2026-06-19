import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { CakeIcon, CartIcon, MenuIcon, CloseIcon } from '../icons'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Cake', to: '/cake' },
  { label: 'Pastries', to: '/pastries' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const { cartCount } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleCartClick = () => {
    setMenuOpen(false)
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    navigate('/cart')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo">
          <CakeIcon size={24} />
          <span>Sweet Delights</span>
        </Link>

        <nav className="nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end
              className={({ isActive }) =>
                `nav__link ${isActive ? 'nav__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <Link to="/account" className="header__user header__user--desktop">
              {user.fullName.split(' ')[0]}
            </Link>
          ) : (
            <Link to="/login" className="header__user header__user--desktop">
              Login
            </Link>
          )}
          <button className="cart-btn" onClick={handleCartClick} aria-label="cart">
            <span className="cart-btn__icon">
              <CartIcon size={22} />
              <span className="cart-btn__badge">{cartCount}</span>
            </span>
            <span className="cart-btn__label">ADD CART</span>
          </button>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end
              className={({ isActive }) =>
                `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <Link
              to="/account"
              className="mobile-nav__link mobile-nav__link--accent"
              onClick={() => setMenuOpen(false)}
            >
              My Account ({user.fullName.split(' ')[0]})
            </Link>
          ) : (
            <Link
              to="/login"
              className="mobile-nav__link mobile-nav__link--accent"
              onClick={() => setMenuOpen(false)}
            >
              Login / Register
            </Link>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div
          className="mobile-menu__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CakeIcon, CartIcon } from '../icons'
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

  const handleCartClick = () => {
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
            <Link to="/account" className="header__user">
              {user.fullName.split(' ')[0]}
            </Link>
          ) : (
            <Link to="/login" className="header__user">
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
        </div>
      </div>
    </header>
  )
}

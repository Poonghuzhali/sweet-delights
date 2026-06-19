import { Link, NavLink } from 'react-router-dom'
import { CakeIcon, CartIcon } from '../icons'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Cake', to: '/cake' },
  { label: 'Pastries', to: '/pastries' },
  { label: 'About', to: '/#about' },
]

export default function Header() {
  const { cartCount, addToCart } = useCart()

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo">
          <CakeIcon size={24} />
          <span>Sweet Delights</span>
        </Link>
        <nav className="nav">
          {navLinks.map((link) =>
            link.to.includes('#') ? (
              <a key={link.label} href={link.to} className="nav__link">
                {link.label}
              </a>
            ) : (
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
            )
          )}
        </nav>
        <button className="cart-btn" onClick={addToCart} aria-label="cart">
          <span className="cart-btn__icon">
            <CartIcon size={22} />
            <span className="cart-btn__badge">{cartCount}</span>
          </span>
          <span className="cart-btn__label">ADD CART</span>
        </button>
      </div>
    </header>
  )
}

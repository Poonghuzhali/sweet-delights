import { Link } from 'react-router-dom'
import { CakeIcon } from '../icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/" className="logo logo--footer">
          <CakeIcon size={22} />
          <span>Sweet Delights</span>
        </Link>
        <p>Freshly baked happiness delivered to your door.</p>
        <p className="footer__copy">
          © 2025 Sweet Delights Bakery. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

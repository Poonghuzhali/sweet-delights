import { useState } from 'react'
import {
  navLinks,
  flavours,
  pastries,
  behindScenes,
  deliveryFeatures,
  testimonials,
} from './data'
import {
  CakeIcon,
  CartIcon,
  ClockIcon,
  ShieldIcon,
  PinIcon,
  BikeIcon,
  Star,
  BadgeIcon,
} from './icons'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80'

function App() {
  const [cartCount, setCartCount] = useState(0)
  const addToCart = () => setCartCount((c) => c + 1)

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="container header__inner">
          <a href="#home" className="logo">
            <CakeIcon size={24} />
            <span>Sweet Delights</span>
          </a>
          <nav className="nav">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className={`nav__link ${i === 0 ? 'nav__link--active' : ''}`}
              >
                {link}
              </a>
            ))}
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

      {/* Hero */}
      <section className="hero" id="home">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="eyebrow">
              <BadgeIcon size={14} /> Premium Bakery
            </span>
            <h1>
              Freshly Baked Happiness Delivered to Your Door
            </h1>
            <p>
              Experience the finest cakes and pastries crafted with love,
              premium ingredients, and a touch of magic. Perfect for every
              celebration.
            </p>
            <button className="btn btn--primary" onClick={addToCart}>
              Order Now
            </button>
          </div>
          <div className="hero__media">
            <img src={HERO_IMAGE} alt="Decorated celebration cake" />
          </div>
        </div>
      </section>

      {/* Signature Flavours */}
      <section className="section section--gray" id="cake">
        <div className="container">
          <h2 className="section__title">Our Signature Flavours</h2>
          <div className="cards">
            {flavours.map((item) => (
              <article className="card" key={item.name}>
                <div className="card__media">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="card__body">
                  <h3 className="card__title">{item.name}</h3>
                  <p className="card__desc">{item.desc}</p>
                  <span className="card__price">{item.price}</span>
                  <button className="btn btn--primary btn--block" onClick={addToCart}>
                    ADD TO CART
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pastries */}
      <section className="section section--gray section--tight" id="pastries">
        <div className="container">
          <h2 className="section__title">Delightful Pastries</h2>
          <div className="gallery">
            {pastries.map((src, i) => (
              <div className="gallery__item" key={i}>
                <img src={src} alt={`Pastry ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="section section--cream" id="about">
        <div className="container">
          <h2 className="section__title">Behind the Scenes</h2>
          <p className="section__subtitle">
            Made in a clean and hygienic kitchen with premium ingredients. Our
            bakers pour their passion into every single creation.
          </p>
          <div className="scenes">
            {behindScenes.map((item) => (
              <div className="scene" key={item.title}>
                <div className="scene__avatar">
                  <img src={item.image} alt={item.title} />
                </div>
                <span className="scene__label">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery banner */}
      <section className="section section--cream section--tight">
        <div className="container">
          <div className="delivery">
            <div className="delivery__content">
              <h3>Freshness Delivered Quickly</h3>
              <ul>
                <li>
                  <ClockIcon /> {deliveryFeatures[0]}
                </li>
                <li>
                  <ShieldIcon /> {deliveryFeatures[1]}
                </li>
                <li>
                  <PinIcon /> {deliveryFeatures[2]}
                </li>
              </ul>
            </div>
            <div className="delivery__icon">
              <BikeIcon size={90} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section--pink-soft">
        <div className="container">
          <h2 className="section__title">What Our Customers Say</h2>
          <div className="testimonials">
            {testimonials.map((t) => (
              <article className="testimonial" key={t.name}>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="testimonial__text">{t.text}</p>
                <div className="testimonial__author">
                  <img src={t.image} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <a href="#home" className="logo logo--footer">
            <CakeIcon size={22} />
            <span>Sweet Delights</span>
          </a>
          <p>Freshly baked happiness delivered to your door.</p>
          <p className="footer__copy">
            © 2025 Sweet Delights Bakery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

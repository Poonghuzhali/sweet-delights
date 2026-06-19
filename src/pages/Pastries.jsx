import { useState } from 'react'
import {
  pastryBanner,
  pastryCategories,
  pastryItems,
  eventPerks,
  eventImages,
} from '../data'
import { CheckIcon, BadgeIcon } from '../icons'
import { useCart } from '../context/CartContext'
import BehindScenes from '../components/BehindScenes'
import Testimonials from '../components/Testimonials'

export default function Pastries() {
  const { addToCart } = useCart()
  const [active, setActive] = useState('All Items')

  const visible =
    active === 'All Items'
      ? pastryItems
      : pastryItems.filter((p) => p.category === active)

  return (
    <>
      {/* Banner strip */}
      <section className="pastry-banner">
        {pastryBanner.map((src, i) => (
          <div className="pastry-banner__cell" key={i}>
            <img src={src} alt={`Pastry ${i + 1}`} />
          </div>
        ))}
      </section>

      {/* Collection */}
      <section className="section section--pink-soft">
        <div className="container">
          <h2 className="collection__title">The Morning Collection</h2>
          <p className="section__subtitle">
            Begin your day with our freshly baked pastries, made every morning
            with butter, love and a little bit of magic.
          </p>

          <div className="filters">
            {pastryCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${
                  active === cat ? 'filter-pill--active' : ''
                }`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pastry-grid">
            {visible.map((item) => (
              <article className="pastry-card" key={item.name}>
                <div className="pastry-card__media">
                  <img src={item.image} alt={item.name} />
                  {item.badge && (
                    <span className="pastry-card__badge">{item.badge}</span>
                  )}
                </div>
                <div className="pastry-card__body">
                  <div className="pastry-card__head">
                    <h3>{item.name}</h3>
                    <span className="pastry-card__price">{item.price}</span>
                  </div>
                  <p className="pastry-card__desc">{item.desc}</p>
                  <button
                    className="btn btn--primary btn--block"
                    onClick={addToCart}
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Behind the Scenes */}
      <BehindScenes />

      {/* Events / booking */}
      <section className="section section--pink-soft section--tight">
        <div className="container">
          <div className="events">
            <div className="events__media">
              {eventImages.map((src, i) => (
                <img src={src} alt={`Event cake ${i + 1}`} key={i} />
              ))}
            </div>
            <div className="events__content">
              <span className="eyebrow">
                <BadgeIcon size={14} /> Premium Service
              </span>
              <h3>We accept birthday party &amp; event orders</h3>
              <p>
                Planning a celebration? Let us craft the perfect centrepiece.
                From intimate gatherings to grand parties, we deliver fresh,
                custom cakes and pastries right on time.
              </p>
              <ul>
                {eventPerks.map((perk) => (
                  <li key={perk}>
                    <span className="events__check">
                      <CheckIcon size={14} />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
              <button className="btn btn--primary" onClick={addToCart}>
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

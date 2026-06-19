import {
  cakeBanner,
  cakeItems,
  eventPerks,
  eventImages,
} from '../data'
import { CheckIcon, BadgeIcon } from '../icons'
import { useCart } from '../context/CartContext'
import BehindScenes from '../components/BehindScenes'
import Testimonials from '../components/Testimonials'

export default function Cake() {
  const { addToCart } = useCart()

  return (
    <>
      {/* Banner strip */}
      <section className="cake-banner">
        {cakeBanner.map((src, i) => (
          <div className="cake-banner__cell" key={i}>
            <img src={src} alt={`Cake ${i + 1}`} />
          </div>
        ))}
      </section>

      {/* Flavours */}
      <section className="section section--pink-soft">
        <div className="container">
          <h2 className="collection__title">The Cake Flavours</h2>
          <p className="section__subtitle">
            Pick from our handcrafted signature cakes, baked fresh with premium
            ingredients and finished with love for every celebration.
          </p>

          <div className="cards">
            {cakeItems.map((item) => (
              <article className="card" key={item.name}>
                <div className="card__media">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="card__body">
                  <h3 className="card__title">{item.name}</h3>
                  <p className="card__desc">{item.desc}</p>
                  <span className="card__price">{item.price}</span>
                  <button
                    className="btn btn--primary btn--block"
                    onClick={addToCart}
                  >
                    Order Now
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
              <h3>We accept birthday party &amp; orders</h3>
              <p>
                Planning a celebration? Let us craft the perfect centrepiece.
                From intimate gatherings to grand parties, we deliver fresh,
                custom cakes right on time.
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

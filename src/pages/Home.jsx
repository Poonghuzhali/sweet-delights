import { flavours, pastries, deliveryFeatures } from '../data'
import { ClockIcon, ShieldIcon, PinIcon, BikeIcon, BadgeIcon } from '../icons'
import { useCart } from '../context/CartContext'
import BehindScenes from '../components/BehindScenes'
import Testimonials from '../components/Testimonials'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80'

export default function Home() {
  const { addToCart } = useCart()

  return (
    <>
      {/* Hero */}
      <section className="hero" id="home">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="eyebrow">
              <BadgeIcon size={14} /> Premium Bakery
            </span>
            <h1>Freshly Baked Happiness Delivered to Your Door</h1>
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
                  <button
                    className="btn btn--primary btn--block"
                    onClick={addToCart}
                  >
                    ADD TO CART
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pastries gallery */}
      <section className="section section--gray section--tight">
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
      <BehindScenes id="about" />

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
      <Testimonials />
    </>
  )
}

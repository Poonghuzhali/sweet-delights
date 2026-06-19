import { testimonials } from '../data'
import { Star } from '../icons'

export default function Testimonials() {
  return (
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
  )
}

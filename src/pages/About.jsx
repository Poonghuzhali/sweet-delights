import { useNavigate } from 'react-router-dom'
import { aboutHeroImage, aboutValues, team } from '../data'
import { BadgeIcon, SparkleIcon, ShieldIcon, HeartIcon } from '../icons'

const valueIcons = {
  sparkle: <SparkleIcon size={22} />,
  shield: <ShieldIcon size={22} />,
  heart: <HeartIcon size={22} />,
}

export default function About() {
  const navigate = useNavigate()

  return (
    <>
      {/* Our Story */}
      <section className="section section--pink-soft" id="about">
        <div className="container about-hero">
          <div className="about-hero__text">
            <span className="eyebrow">
              <BadgeIcon size={14} /> Our Story
            </span>
            <h1>Crafting Sweet Memories Since 2010</h1>
            <p>
              What started as a small home kitchen experiment has blossomed into
              the city's most loved premium bakery. At Sweet Delights, we believe
              that every cake tells a story and every pastry holds a piece of
              magic.
            </p>
            <p>
              Our founder, guided by a passion for authentic flavors and artistic
              presentation, built this bakery on one simple principle: never
              compromise on quality. Today, that principle still guides everything
              we do.
            </p>
          </div>
          <div className="about-hero__media">
            <img src={aboutHeroImage} alt="Sweet Delights bakery interior" />
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section__title">What We Stand For</h2>
          <p className="section__subtitle">
            Our commitment to excellence goes beyond just baking. It's about
            delivering a truly premium, hygienic, and unforgettable experience.
          </p>
          <div className="values">
            {aboutValues.map((value) => (
              <article className="value-card" key={value.title}>
                <span className="value-card__icon">
                  {valueIcons[value.icon]}
                </span>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Master Bakers */}
      <section className="section">
        <div className="container">
          <h2 className="section__title">Meet Our Master Bakers</h2>
          <p className="section__subtitle">
            The talented hands and creative minds behind your favorite sweet
            delights.
          </p>
          <div className="team">
            {team.map((member) => (
              <div className="team-member" key={member.name}>
                <div className="team-member__avatar">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <span className="team-member__role">{member.role}</span>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--tight">
        <div className="container">
          <div className="cta">
            <h2>Ready to taste the magic?</h2>
            <p>
              Explore our menu of handcrafted cakes and delightful pastries.
              Freshly baked happiness is just a click away.
            </p>
            <button className="btn btn--light" onClick={() => navigate('/cake')}>
              Explore Menu &amp; Order
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

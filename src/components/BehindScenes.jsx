import { behindScenes } from '../data'

export default function BehindScenes({ id }) {
  return (
    <section className="section section--cream" id={id}>
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
  )
}

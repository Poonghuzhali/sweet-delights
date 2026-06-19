import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pastryItems, selectPastryHero } from '../data'
import { useCart } from '../context/CartContext'

export default function SelectPastries() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const allIds = useMemo(() => pastryItems.map((item) => item.id), [])
  const allSelected = selected.length === pastryItems.length
  const someSelected = selected.length > 0

  const toggleItem = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : allIds)
  }

  const addSelectedToCart = () => {
    addToCart(selected.length)
    navigate('/cart')
  }

  return (
    <>
      <section className="select-pastry-hero">
        {selectPastryHero.map((src, i) => (
          <div className="select-pastry-hero__cell" key={i}>
            <img src={src} alt={`Pastry spread ${i + 1}`} />
          </div>
        ))}
      </section>

      <section className="section section--pink-soft select-pastries">
        <div className="container">
          <h2 className="collection__title">Our Morning Collection</h2>
          <p className="section__subtitle">
            Freshly baked every morning with the finest ingredients. Select your
            favourites and add them to cart.
          </p>

          <div className="select-toolbar">
            <label className="select-toolbar__all">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
              />
              <span>Select All ({pastryItems.length} pastries)</span>
            </label>
            <span className="select-toolbar__count">
              {selected.length} selected
            </span>
            <div className="select-toolbar__actions">
              <button
                type="button"
                className="btn btn--outline"
                disabled={!someSelected}
                onClick={() => setSelected([])}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={!someSelected}
                onClick={addSelectedToCart}
              >
                Add Selected to Cart
              </button>
            </div>
          </div>

          <div className="select-pastry-grid">
            {pastryItems.map((item) => {
              const isSelected = selected.includes(item.id)
              return (
                <article
                  className={`select-pastry-card ${
                    isSelected ? 'select-pastry-card--selected' : ''
                  }`}
                  key={item.id}
                >
                  <label className="select-pastry-card__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item.id)}
                    />
                  </label>
                  <div className="select-pastry-card__media">
                    <img src={item.image} alt={item.name} />
                    {item.badge && (
                      <span className="pastry-card__badge">{item.badge}</span>
                    )}
                  </div>
                  <div className="select-pastry-card__body">
                    <h3>{item.name}</h3>
                    <span className="select-pastry-card__price">
                      {item.price}
                    </span>
                    <button
                      type="button"
                      className="btn btn--primary btn--block"
                      onClick={() => addToCart(1)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="select-pastries__back">
            <Link to="/pastries" className="btn btn--outline">
              ← Back to Pastries
            </Link>
          </div>
        </div>
      </section>

      {someSelected && (
        <div className="select-bar">
          <div className="container select-bar__inner">
            <span>{selected.length} pastry items selected</span>
            <button
              type="button"
              className="btn btn--primary"
              onClick={addSelectedToCart}
            >
              Add Selected to Cart
            </button>
          </div>
        </div>
      )}
    </>
  )
}

import { createContext, useContext, useMemo, useState } from 'react'
import { parsePrice, slugify } from '../utils/cart'

const CartContext = createContext(null)

function normalizeProduct(product) {
  const id = product.id || slugify(product.name)
  return {
    id,
    name: product.name,
    price: parsePrice(product.price),
    image: product.image,
    detail: product.detail || '1 pc • Fresh',
    qty: product.qty || 1,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = (product) => {
    const normalized = normalizeProduct(product)
    setItems((prev) => {
      const existing = prev.find((item) => item.id === normalized.id)
      if (existing) {
        return prev.map((item) =>
          item.id === normalized.id
            ? { ...item, qty: item.qty + normalized.qty }
            : item
        )
      }
      return [...prev, normalized]
    })
  }

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleUpsell = (upsell) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === upsell.id)
      if (exists) {
        return prev.filter((item) => item.id !== upsell.id)
      }
      return [...prev, normalizeProduct({ ...upsell, detail: 'Add-on' })]
    })
  }

  const isInCart = (id) => items.some((item) => item.id === id)

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  )

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addToCart,
        updateQty,
        removeFromCart,
        toggleUpsell,
        isInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cake from './pages/Cake'
import Pastries from './pages/Pastries'
import About from './pages/About'
import Checkout from './pages/Checkout'
import PlaceOrder from './pages/PlaceOrder'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppLayout() {
  const { pathname } = useLocation()
  const isPlaceOrder = pathname === '/place-order'

  return (
    <div className="page">
      {!isPlaceOrder && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cake" element={<Cake />} />
        <Route path="/pastries" element={<Pastries />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Checkout />} />
        <Route path="/place-order" element={<PlaceOrder />} />
      </Routes>
      {!isPlaceOrder && <Footer />}
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <AppLayout />
    </CartProvider>
  )
}

export default App

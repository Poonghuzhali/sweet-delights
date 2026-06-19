import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cake from './pages/Cake'
import Pastries from './pages/Pastries'
import SelectPastries from './pages/SelectPastries'
import About from './pages/About'
import Checkout from './pages/Checkout'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <div className="page">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cake" element={<Cake />} />
          <Route path="/pastries" element={<Pastries />} />
          <Route path="/pastries/select" element={<SelectPastries />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Checkout />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App

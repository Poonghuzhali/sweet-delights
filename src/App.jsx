import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cake from './pages/Cake'
import Pastries from './pages/Pastries'
import About from './pages/About'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Account from './pages/Account'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <div className="page">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cake" element={<Cake />} />
            <Route path="/pastries" element={<Pastries />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Checkout />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

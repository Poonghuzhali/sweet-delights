import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  buildTrackingTimeline,
  generateId,
  getOrders,
  getSession,
  getUsers,
  saveOrders,
  saveSession,
  saveUsers,
} from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session?.userId) {
      const found = getUsers().find((u) => u.id === session.userId)
      if (found) {
        setUser(found)
        setOrders(getOrders().filter((o) => o.userId === found.id))
      } else {
        saveSession(null)
      }
    }
    setReady(true)
  }, [])

  const register = (data) => {
    const users = getUsers()
    const email = data.email.trim().toLowerCase()

    if (users.some((u) => u.email === email)) {
      return { success: false, error: 'An account with this email already exists' }
    }

    const newUser = {
      id: generateId('USR'),
      fullName: data.fullName.trim(),
      email,
      phone: data.phone.trim(),
      password: data.password,
      address: data.address.trim(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)
    saveSession({ userId: newUser.id })
    setUser(newUser)
    setOrders([])
    return { success: true }
  }

  const login = (email, password) => {
    const found = getUsers().find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    )

    if (!found) {
      return { success: false, error: 'Invalid email or password' }
    }

    saveSession({ userId: found.id })
    setUser(found)
    setOrders(getOrders().filter((o) => o.userId === found.id))
    return { success: true }
  }

  const logout = () => {
    saveSession(null)
    setUser(null)
    setOrders([])
  }

  const updateProfile = (updates) => {
    if (!user) return { success: false, error: 'Not logged in' }

    const users = getUsers()
    const updatedUser = {
      ...user,
      fullName: updates.fullName.trim(),
      phone: updates.phone.trim(),
      address: updates.address.trim(),
    }

    const nextUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
    saveUsers(nextUsers)
    setUser(updatedUser)
    return { success: true }
  }

  const placeOrder = (orderData) => {
    if (!user) return { success: false, error: 'Login required' }

    const trackingId = generateId('TRK')
    const order = {
      id: generateId('ORD'),
      trackingId,
      userId: user.id,
      items: orderData.items,
      delivery: orderData.delivery,
      payment: orderData.payment,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      taxes: orderData.taxes,
      total: orderData.total,
      status: 'Order Placed',
      statusIndex: 0,
      tracking: buildTrackingTimeline(0),
      createdAt: new Date().toISOString(),
    }

    const allOrders = getOrders()
    allOrders.unshift(order)
    saveOrders(allOrders)
    setOrders((prev) => [order, ...prev])
    return { success: true, order }
  }

  const isAuthenticated = !!user

  const value = useMemo(
    () => ({
      user,
      orders,
      ready,
      isAuthenticated,
      register,
      login,
      logout,
      updateProfile,
      placeOrder,
    }),
    [user, orders, ready]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import { trackEvent } from './utils/analytics'
import './App.css'

function App() {
  const cartItems = useSelector((state) => state.cart.items)

  useEffect(() => {
    // Track page view on mount
    trackEvent({
      action: 'pageview',
      route: window.location.pathname,
      metadata: { 
        title: document.title,
        referrer: document.referrer 
      }
    })

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent({
          action: 'page_hidden',
          route: window.location.pathname
        })
      } else {
        trackEvent({
          action: 'page_visible',
          route: window.location.pathname
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      trackEvent({
        action: 'page_unload',
        route: window.location.pathname
      })
    }
  }, [])

  // Track cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      trackEvent({
        action: 'cart_updated',
        route: '/cart',
        metadata: { 
          itemCount: cartItems.length,
          totalValue: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
      })
    }
  }, [cartItems])

  return (
    <div className="app">
      <div className="container">
        <Header />
        <div className="main-content">
          <ProductList />
          <Cart />
        </div>
      </div>
    </div>
  )
}

export default App
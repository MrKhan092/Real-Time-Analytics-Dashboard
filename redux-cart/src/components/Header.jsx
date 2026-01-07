import React from 'react'
import { useSelector } from 'react-redux'
import { trackEvent } from '../utils/analytics'

export default function Header() {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity)

  const handleLogoClick = () => {
    trackEvent({
      action: 'logo_click',
      route: '/'
    })
  }

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px 32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 
        onClick={handleLogoClick}
        style={{
          fontSize: '28px',
          fontWeight: '800',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer'
        }}
      >
        🛍️ Redux Cart
      </h1>
      <div style={{
        position: 'relative',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🛒 Cart
        {totalQuantity > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '800'
          }}>
            {totalQuantity}
          </span>
        )}
      </div>
    </header>
  )
}
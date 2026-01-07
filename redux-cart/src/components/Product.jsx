import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { trackEvent } from '../utils/analytics'

export default function Product({ product }) {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    trackEvent({
      action: 'add_to_cart',
      route: '/products',
      metadata: {
        productId: product.id,
        productName: product.name,
        price: product.price
      }
    })
  }

  const handleProductClick = () => {
    trackEvent({
      action: 'product_view',
      route: `/products/${product.id}`,
      metadata: {
        productId: product.id,
        productName: product.name
      }
    })
  }

  return (
    <div 
      onClick={handleProductClick}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        fontSize: '64px',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        {product.image}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#333'
      }}>
        {product.name}
      </h3>
      <p style={{
        fontSize: '24px',
        fontWeight: '800',
        color: '#667eea',
        marginBottom: '16px'
      }}>
        ${product.price}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleAddToCart()
        }}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
        }}
      >
        Add to Cart
      </button>
    </div>
  )
}
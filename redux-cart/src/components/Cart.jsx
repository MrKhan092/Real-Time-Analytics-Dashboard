import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart, clearCart } from '../store/cartSlice'
import { trackEvent } from '../utils/analytics'

export default function Cart() {
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const handleCheckout = () => {
    trackEvent({
      action: 'checkout_initiated',
      route: '/checkout',
      metadata: {
        totalAmount: cart.totalAmount,
        totalItems: cart.totalQuantity
      }
    })
    alert('Checkout initiated! Check the analytics dashboard.')
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    trackEvent({
      action: 'cart_cleared',
      route: '/cart'
    })
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      height: 'fit-content',
      position: 'sticky',
      top: '20px'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px',
        color: '#333'
      }}>
        🛒 Your Cart
      </h2>

      {cart.items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#999'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            marginBottom: '16px'
          }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {item.name}
                  </div>
                  <div style={{ color: '#667eea', fontWeight: '700' }}>
                    ${item.price} × {item.quantity}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      dispatch(removeFromCart(item.id))
                      trackEvent({
                        action: 'remove_from_cart',
                        route: '/cart',
                        metadata: { productId: item.id, productName: item.name }
                      })
                    }}
                    style={{
                      padding: '4px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    −
                  </button>
                  <button
                    onClick={() => {
                      dispatch(addToCart(item))
                      trackEvent({
                        action: 'add_to_cart',
                        route: '/cart',
                        metadata: { productId: item.id, productName: item.name }
                      })
                    }}
                    style={{
                      padding: '4px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '2px solid #e5e7eb',
            paddingTop: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '20px',
              fontWeight: '800',
              color: '#333',
              marginBottom: '8px'
            }}>
              <span>Total:</span>
              <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#999',
              textAlign: 'right'
            }}>
              {cart.totalQuantity} items
            </div>
          </div>

          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
            }}
          >
            Checkout
          </button>

          <button
            onClick={handleClearCart}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#ef4444',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ef4444'
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.color = '#ef4444'
            }}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  )
}
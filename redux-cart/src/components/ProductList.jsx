import React from 'react'
import Product from './Product'

const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 59.99, image: '🎧' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: '⌚' },
  { id: 3, name: 'Laptop Stand', price: 29.99, image: '💻' },
  { id: 4, name: 'Mechanical Keyboard', price: 89.99, image: '⌨️' },
  { id: 5, name: 'USB-C Cable', price: 12.99, image: '🔌' },
  { id: 6, name: 'Phone Case', price: 19.99, image: '📱' },
  { id: 7, name: 'Wireless Mouse', price: 39.99, image: '🖱️' },
  { id: 8, name: 'Portable Charger', price: 34.99, image: '🔋' }
]

export default function ProductList() {
  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: 'white',
        marginBottom: '16px',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        🎯 Featured Products
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {PRODUCTS.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
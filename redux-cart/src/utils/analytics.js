import { io } from 'socket.io-client'

let socket = null
let sessionId = null
let userId = null

// Generate unique IDs
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Initialize analytics connection
export function initAnalytics() {
  if (socket) return socket

  // Get or create session ID
  sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = generateId()
    sessionStorage.setItem('analytics_session_id', sessionId)
  }

  // Get or create user ID
  userId = localStorage.getItem('analytics_user_id')
  if (!userId) {
    userId = `user_${generateId()}`
    localStorage.setItem('analytics_user_id', userId)
  }

  // Connect to backend
  socket = io('http://localhost:3001/website', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  })

  socket.on('connect', () => {
    console.log('📊 Analytics connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('📊 Analytics disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('📊 Analytics connection error:', error.message)
  })

  return socket
}

// Track an event
export function trackEvent(data) {
  if (!socket || !socket.connected) {
    initAnalytics()
  }

  const event = {
    eventId: generateId(),
    timestamp: new Date().toISOString(),
    userId: userId,
    sessionId: sessionId,
    route: data.route || window.location.pathname,
    action: data.action || 'unknown',
    metadata: {
      ...data.metadata,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language
    }
  }

  socket?.emit('user_event', event)
  console.log('📊 Event tracked:', event.action, event.route)
}

// Initialize on import
initAnalytics()
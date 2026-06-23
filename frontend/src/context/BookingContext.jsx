import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BookingModal from '../components/BookingModal'
import Toast from '../components/Toast'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const openBooking = useCallback(() => setIsBookingOpen(true), [])
  const closeBooking = useCallback(() => setIsBookingOpen(false), [])

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
  }, [])

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = setTimeout(() => setToastMessage(''), 5000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const value = useMemo(
    () => ({ openBooking, closeBooking, showToast }),
    [openBooking, closeBooking, showToast],
  )

  return (
    <BookingContext.Provider value={value}>
      {children}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        onSuccess={(message) => showToast(message, 'success')}
      />
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

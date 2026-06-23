import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function useSignOut(onToast) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return useCallback(() => {
    const role = user?.role
    logout()
    onToast?.('Successfully signed out')
    navigate(role === 'PATIENT' ? '/login' : '/admin/login')
  }, [user, logout, navigate, onToast])
}

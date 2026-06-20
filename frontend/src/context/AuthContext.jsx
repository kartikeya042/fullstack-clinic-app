import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'clinic_token'
const USER_KEY = 'clinic_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => readStoredUser())

  const login = useCallback((nextToken, userData) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(nextToken)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((newUserData, nextToken = null) => {
    localStorage.setItem(USER_KEY, JSON.stringify(newUserData))
    setUser(newUserData)

    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
      setToken(nextToken)
    }
  }, [])

  const value = useMemo(
    () => ({ user, token, login, logout, updateUser, isAuthenticated: Boolean(token && user) }),
    [user, token, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

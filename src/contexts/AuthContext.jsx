import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [reacterSession, setReacterSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('rmf_reacter_session')) } catch { return null }
  })
  const [adminSession, setAdminSession] = useState(() => {
    return sessionStorage.getItem('rmf_admin_session') === '1'
  })

  const loginReacter = (rut, reacter) => {
    const session = { rut, reacter }
    setReacterSession(session)
    sessionStorage.setItem('rmf_reacter_session', JSON.stringify(session))
  }

  const updateReacterInSession = (reacter) => {
    const session = { ...reacterSession, reacter }
    setReacterSession(session)
    sessionStorage.setItem('rmf_reacter_session', JSON.stringify(session))
  }

  const logoutReacter = () => {
    setReacterSession(null)
    sessionStorage.removeItem('rmf_reacter_session')
  }

  const loginAdmin = () => {
    setAdminSession(true)
    sessionStorage.setItem('rmf_admin_session', '1')
  }

  const logoutAdmin = () => {
    setAdminSession(false)
    sessionStorage.removeItem('rmf_admin_session')
  }

  return (
    <AuthContext.Provider value={{
      reacterSession,
      adminSession,
      loginReacter,
      updateReacterInSession,
      logoutReacter,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

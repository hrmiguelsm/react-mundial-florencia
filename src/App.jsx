import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { seedMatchesIfEmpty } from './lib/db.js'

import Landing from './pages/Landing.jsx'
import ReacterLogin from './pages/ReacterLogin.jsx'
import ReacterProfile from './pages/ReacterProfile.jsx'
import ReacterDashboard from './pages/ReacterDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import MatchesAdmin from './pages/admin/MatchesAdmin.jsx'
import ReactersAdmin from './pages/admin/ReactersAdmin.jsx'
import AuthorizedRuts from './pages/admin/AuthorizedRuts.jsx'
import Registrations from './pages/admin/Registrations.jsx'
import Settings from './pages/admin/Settings.jsx'

function ReacterGuard({ children }) {
  const { reacterSession } = useAuth()
  if (!reacterSession) return <Navigate to="/reacter/login" replace />
  return children
}

function AdminGuard({ children }) {
  const { adminSession } = useAuth()
  if (!adminSession) return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  useEffect(() => { seedMatchesIfEmpty().catch(console.error) }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Reacter routes */}
          <Route path="/reacter/login" element={<ReacterLogin />} />
          <Route path="/reacter/perfil" element={
            <ReacterGuard><ReacterProfile /></ReacterGuard>
          } />
          <Route path="/reacter/partidos" element={
            <ReacterGuard><ReacterDashboard /></ReacterGuard>
          } />

          {/* Admin routes */}
          <Route path="/admin">
            <Route index element={<AdminLogin />} />
            <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route path="partidos" element={<MatchesAdmin />} />
              <Route path="reacters" element={<ReactersAdmin />} />
              <Route path="ruts" element={<AuthorizedRuts />} />
              <Route path="inscripciones" element={<Registrations />} />
              <Route path="config" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Trophy, Tv, Users, ShieldCheck, ClipboardList, Settings, LogOut, Menu, X } from 'lucide-react'

const NAV = [
  { path: '/admin/partidos', label: 'Partidos', icon: Tv },
  { path: '/admin/reacters', label: 'Reacters', icon: Users },
  { path: '/admin/ruts', label: 'RUT Autorizados', icon: ShieldCheck },
  { path: '/admin/inscripciones', label: 'Inscripciones', icon: ClipboardList },
  { path: '/admin/config', label: 'Configuración', icon: Settings },
]

function NavItem({ path, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
          isActive
            ? 'gold-gradient text-navy-950 font-bold shadow-lg'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function AdminLayout() {
  const { logoutAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logoutAdmin(); navigate('/admin') }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-900 border-r border-white/5 fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <p className="font-black text-white text-sm leading-tight">React Mundial</p>
              <p className="text-gold-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(n => <NavItem key={n.path} {...n} />)}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-navy-900 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <p className="font-bold text-white text-sm">Admin Panel</p>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white/60 hover:text-white transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-navy-900 p-4 pt-16 space-y-1 overflow-y-auto" onClick={e => e.stopPropagation()}>
            {NAV.map(n => <NavItem key={n.path} {...n} onClick={() => setMobileOpen(false)} />)}
            <div className="pt-4 border-t border-white/5 mt-4">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-xl text-sm font-medium">
                <LogOut className="w-5 h-5" />Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

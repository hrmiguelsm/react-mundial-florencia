import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { loginAdmin, adminSession } = useAuth()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (adminSession) navigate('/admin/partidos', { replace: true })
  }, [adminSession])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (user === 'florenciadigital' && pass === 'odin') {
        loginAdmin()
        // navigation handled by the useEffect watching adminSession
      } else {
        setError('Credenciales incorrectas')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <div className="bg-navy-800 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white/40" />
            </div>
            <h1 className="text-xl font-black text-white mb-1">Panel Admin</h1>
            <p className="text-white/40 text-sm">Florencia Digital</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Usuario</label>
              <input
                type="text"
                value={user}
                onChange={e => { setUser(e.target.value); setError('') }}
                className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="usuario"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={e => { setPass(e.target.value); setError('') }}
                className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-5 h-5" /> Ingresar</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

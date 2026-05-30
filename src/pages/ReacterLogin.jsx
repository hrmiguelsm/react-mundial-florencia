import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogIn, AlertCircle } from 'lucide-react'
import { formatRut, cleanRut, validateRut } from '../utils/rut.js'
import { authorizedUsers, reacters } from '../lib/demoStorage.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ReacterLogin() {
  const navigate = useNavigate()
  const { loginReacter } = useAuth()
  const [rut, setRut] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRutChange = (e) => {
    const raw = e.target.value
    const cleaned = raw.replace(/[^0-9kK]/g, '')
    setRut(cleaned.length > 0 ? formatRut(cleaned) : '')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const cleaned = cleanRut(rut)
    if (!validateRut(cleaned)) {
      setError('RUT inválido. Verifica que sea correcto.')
      return
    }
    setLoading(true)
    try {
      const user = authorizedUsers.getByRut(formatRut(cleaned))
      if (!user) {
        setError('Este RUT no está autorizado para participar. Contacta a Florencia Digital.')
        setLoading(false)
        return
      }
      if (user.status === 'blocked') {
        setError('Tu RUT está bloqueado. Contacta a Florencia Digital.')
        setLoading(false)
        return
      }
      const reacter = reacters.getByRut(formatRut(cleaned))
      loginReacter(formatRut(cleaned), reacter)
      if (reacter) {
        navigate('/reacter/partidos')
      } else {
        navigate('/reacter/perfil')
      }
    } catch (err) {
      setError('Error al verificar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        {/* Card */}
        <div className="bg-navy-800 border border-gold-600/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🎙️</div>
            <h1 className="text-2xl font-black text-white mb-1">Ingreso Reacters</h1>
            <p className="text-white/50 text-sm">Ingresa tu RUT para participar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">RUT Chileno</label>
              <input
                type="text"
                value={rut}
                onChange={handleRutChange}
                placeholder="12.345.678-9"
                className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 text-lg font-mono tracking-wider transition-colors"
                maxLength={12}
                autoFocus
              />
              <p className="mt-1.5 text-xs text-white/30">Formato: XX.XXX.XXX-X</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || rut.length < 3}
              className="w-full gold-gradient text-navy-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity glow-gold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Ingresar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-navy-900 rounded-xl border border-white/5">
            <p className="text-xs text-white/40 text-center">
              <span className="text-gold-500 font-semibold">Demo:</span> RUTs válidos: 12.345.678-9 · 98.765.432-1 · 11.111.111-1
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

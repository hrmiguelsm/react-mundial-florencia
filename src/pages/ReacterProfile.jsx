import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, User, Phone, Mail, Users, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { reacters, authorizedUsers } from '../lib/db.js'
import { formatRut, cleanRut, validateRut } from '../utils/rut.js'

const INPUT = 'w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 transition-colors'
const LABEL = 'block text-sm font-medium text-white/70 mb-2'

function Field({ label, icon: Icon, error, ...props }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />}
        <input className={`${INPUT} ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500/50' : ''}`} {...props} />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default function ReacterProfile() {
  const navigate = useNavigate()
  const { reacterSession, updateReacterInSession } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    has_duo: false,
    duo_rut: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  // Duo lookup state
  const [duoLookup, setDuoLookup] = useState({ loading: false, found: null, error: '' })
  // found = { rut, name, email, phone } | null

  useEffect(() => {
    if (reacterSession?.reacter) {
      const r = reacterSession.reacter
      setForm({
        name: r.name || '', email: r.email || '', phone: r.phone || '',
        has_duo: r.has_duo || false,
        duo_rut: r.duo_rut || '',
      })
      // If they had a duo, attempt lookup to re-populate
      if (r.duo_rut) lookupDuo(r.duo_rut, false)
    }
  }, [])

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  // Lookup duo by RUT in authorized_users + reacters
  const lookupDuo = useCallback(async (rawRut, showLoading = true) => {
    const cleaned = cleanRut(rawRut)
    if (!cleaned || cleaned.length < 3) {
      setDuoLookup({ loading: false, found: null, error: '' })
      return
    }
    if (!validateRut(cleaned)) {
      setDuoLookup({ loading: false, found: null, error: 'RUT inválido' })
      return
    }

    const formatted = formatRut(cleaned)
    if (showLoading) setDuoLookup({ loading: true, found: null, error: '' })

    // Search in authorized_users first
    const authUser = await authorizedUsers.getByRut(formatted)
    if (!authUser || authUser.status === 'blocked') {
      setDuoLookup({ loading: false, found: null, error: 'El RUT ingresado no se encuentra autorizado por Florencia Digital.' })
      return
    }

    // Enrich with reacter profile if exists
    const reacterProfile = await reacters.getByRut(formatted)
    setDuoLookup({
      loading: false,
      found: {
        rut: formatted,
        name: reacterProfile?.name || authUser.name || '',
        email: reacterProfile?.email || authUser.email || '',
        phone: reacterProfile?.phone || authUser.phone || '',
      },
      error: '',
    })
  }, [])

  const handleDuoRutChange = (e) => {
    const raw = e.target.value.replace(/[^0-9kK]/g, '')
    const formatted = raw.length > 0 ? formatRut(raw) : ''
    set('duo_rut', formatted)
    setDuoLookup({ loading: false, found: null, error: '' })
  }

  const handleDuoRutBlur = () => {
    if (form.duo_rut) lookupDuo(form.duo_rut)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    if (form.has_duo) {
      if (!form.duo_rut.trim()) {
        e.duo_rut = 'Requerido'
      } else if (!duoLookup.found) {
        e.duo_rut = 'Debes buscar y confirmar el RUT de tu dupla'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const duo = form.has_duo && duoLookup.found ? duoLookup.found : null
      const data = {
        rut: reacterSession.rut,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        has_duo: form.has_duo && !!duo,
        duo_name: duo?.name || null,
        duo_rut: duo?.rut || null,
        duo_email: duo?.email || null,
        duo_phone: duo?.phone || null,
      }
      const savedReacter = await reacters.upsert(data)
      // Sync name/email/phone back to authorized_users (Change #3)
      await authorizedUsers.updateProfile(reacterSession.rut, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      })
      updateReacterInSession(savedReacter)
      setSavedOk(true)
      setTimeout(() => navigate('/reacter/partidos'), 1200)
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate('/reacter/partidos')} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Volver a partidos
        </button>

        <div className="bg-navy-800 border border-gold-600/20 rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-1">Mi Perfil</h1>
            <p className="text-white/50 text-sm">RUT: <span className="text-gold-400 font-mono">{reacterSession?.rut}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* My data */}
            <div className="border-b border-white/5 pb-5 space-y-4">
              <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> Mis datos
              </h2>
              <Field label="Nombre completo *" icon={User} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre Apellido" error={errors.name} />
              <Field label="Correo electrónico *" icon={Mail} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" error={errors.email} />
              <Field label="Teléfono *" icon={Phone} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+56 9 1234 5678" error={errors.phone} />
            </div>

            {/* Duo section */}
            <div className="border-b border-white/5 pb-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold-400" />
                  <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">¿Tienes dupla habitual?</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    set('has_duo', !form.has_duo)
                    if (form.has_duo) {
                      set('duo_rut', '')
                      setDuoLookup({ loading: false, found: null, error: '' })
                    }
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.has_duo ? 'bg-gold-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.has_duo ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-xs text-white/40">Activa si tienes una dupla habitual con quien hacer reacciones.</p>

              {form.has_duo && (
                <div className="space-y-3 pl-3 border-l-2 border-gold-500/30">
                  {/* RUT input + search button */}
                  <div>
                    <label className={LABEL}>RUT de tu dupla *</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          className={`${INPUT} font-mono ${errors.duo_rut ? 'border-red-500/50' : ''}`}
                          value={form.duo_rut}
                          onChange={handleDuoRutChange}
                          onBlur={handleDuoRutBlur}
                          placeholder="12.345.678-9"
                          maxLength={12}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => form.duo_rut && lookupDuo(form.duo_rut)}
                        className="px-3 py-2 bg-gold-500/20 border border-gold-500/30 text-gold-400 rounded-xl hover:bg-gold-500/30 transition-colors"
                        title="Buscar RUT"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.duo_rut && <p className="mt-1 text-xs text-red-400">{errors.duo_rut}</p>}
                  </div>

                  {/* Lookup feedback */}
                  {duoLookup.loading && (
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-gold-400 rounded-full animate-spin" />
                      Buscando...
                    </div>
                  )}

                  {duoLookup.error && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                      ⚠️ {duoLookup.error}
                    </div>
                  )}

                  {duoLookup.found && (
                    <div className="bg-green-900/20 border border-green-500/20 rounded-xl px-4 py-3 space-y-2">
                      <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-2">
                        <span>✓</span> Dupla encontrada y autorizada
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-sm">
                        <div className="flex gap-2">
                          <span className="text-white/40 w-20 shrink-0">Nombre:</span>
                          <span className="text-white font-medium">{duoLookup.found.name || '(sin nombre aún)'}</span>
                        </div>
                        {duoLookup.found.email && (
                          <div className="flex gap-2">
                            <span className="text-white/40 w-20 shrink-0">Email:</span>
                            <span className="text-white/70">{duoLookup.found.email}</span>
                          </div>
                        )}
                        {duoLookup.found.phone && (
                          <div className="flex gap-2">
                            <span className="text-white/40 w-20 shrink-0">Teléfono:</span>
                            <span className="text-white/70">{duoLookup.found.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full gold-gradient text-navy-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity glow-gold"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              ) : savedOk ? (
                <><span>✓</span> ¡Guardado!</>
              ) : (
                <><Save className="w-5 h-5" /> Guardar perfil</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

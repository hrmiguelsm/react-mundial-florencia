import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Download, Upload, X, Search, Lock, CheckCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { matches as matchStore, registrations as regStore } from '../../lib/db.js'

const PHASES = [
  'Fase de Grupos - Grupo A', 'Fase de Grupos - Grupo B', 'Fase de Grupos - Grupo C',
  'Fase de Grupos - Grupo D', 'Fase de Grupos - Grupo E', 'Fase de Grupos - Grupo F',
  'Fase de Grupos - Grupo G', 'Fase de Grupos - Grupo H', 'Fase de Grupos - Grupo I',
  'Fase de Grupos - Grupo J', 'Fase de Grupos - Grupo K', 'Fase de Grupos - Grupo L',
  'Octavos de Final', 'Cuartos de Final', 'Semifinal', 'Tercer Lugar', 'Final',
]

// Match statuses
const STATUSES = {
  disabled:  { label: 'Deshabilitado', color: 'text-white/30', bg: 'bg-white/5' },
  active:    { label: 'Abierto',       color: 'text-green-400', bg: 'bg-green-500/10' },
  closed:    { label: 'Cerrado',       color: 'text-orange-400', bg: 'bg-orange-500/10' },
  confirmed: { label: 'Confirmado',    color: 'text-gold-400', bg: 'bg-gold-500/10' },
  finished:  { label: 'Finalizado',    color: 'text-white/50', bg: 'bg-white/5' },
}

const TRANS_OPTIONS = [
  { val: 'studio', label: '🎥 Estudio Florencia' },
  { val: 'home',   label: '🏠 Desde la casa' },
  { val: 'custom', label: '✍️ Personalizado' },
]

const EMPTY = {
  team_a: '', team_b: '', flag_a: '🏳️', flag_b: '🏳️',
  match_date: '', match_time: '', phase: PHASES[0],
  transmission_type: 'studio', custom_transmission_text: '',
  status: 'disabled', notes: '',
}

// ── Edit Modal ─────────────────────────────────────────────────
function MatchModal({ match, onClose, onSave }) {
  const [form, setForm] = useState(match || EMPTY)
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-navy-800 z-10">
          <h2 className="text-lg font-bold text-white">{match ? 'Editar partido' : 'Nuevo partido'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (!form.team_a || !form.team_b) return alert('Equipos requeridos'); onSave(form) }} className="p-6 space-y-4">
          {/* Flags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Bandera A</label>
              <input value={form.flag_a} onChange={e => s('flag_a', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xl" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Bandera B</label>
              <input value={form.flag_b} onChange={e => s('flag_b', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xl" />
            </div>
          </div>
          {/* Teams */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Equipo A *</label>
              <input value={form.team_a} onChange={e => s('team_a', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500" required />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Equipo B *</label>
              <input value={form.team_b} onChange={e => s('team_b', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500" required />
            </div>
          </div>
          {/* Date / Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Fecha</label>
              <input type="date" value={form.match_date} onChange={e => s('match_date', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Hora (Chile)</label>
              <input type="time" value={form.match_time} onChange={e => s('match_time', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500" />
            </div>
          </div>
          {/* Phase */}
          <div>
            <label className="block text-xs text-white/50 mb-1">Fase</label>
            <select value={form.phase} onChange={e => s('phase', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500">
              {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="Otro">Otro</option>
            </select>
          </div>
          {/* Transmission */}
          <div>
            <label className="block text-xs text-white/50 mb-2">Lugar de transmisión</label>
            <div className="space-y-2">
              {TRANS_OPTIONS.map(opt => (
                <label key={opt.val} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="trans" value={opt.val} checked={form.transmission_type === opt.val} onChange={() => s('transmission_type', opt.val)} className="accent-gold-500" />
                  <span className="text-white/80 text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            {form.transmission_type === 'custom' && (
              <input value={form.custom_transmission_text} onChange={e => s('custom_transmission_text', e.target.value)} className="mt-2 w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-sm" placeholder="Ej: Desde móvil en terreno, Programa especial..." />
            )}
          </div>
          {/* Notes */}
          <div>
            <label className="block text-xs text-white/50 mb-1">Notas</label>
            <textarea value={form.notes} onChange={e => s('notes', e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-sm resize-none" rows={2} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 py-3 gold-gradient text-navy-950 font-bold rounded-xl">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Inline Transmission Selector ───────────────────────────────
function TransmissionCell({ match, onChange }) {
  const [open, setOpen] = useState(false)
  const [customText, setCustomText] = useState(match.custom_transmission_text || '')
  const [editingCustom, setEditingCustom] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setEditingCustom(false) } }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (val) => {
    if (val === 'custom') {
      onChange(match.id, { transmission_type: 'custom', custom_transmission_text: customText })
      setEditingCustom(true)
    } else {
      onChange(match.id, { transmission_type: val, custom_transmission_text: '' })
      setOpen(false)
    }
  }

  const saveCustom = () => {
    onChange(match.id, { transmission_type: 'custom', custom_transmission_text: customText })
    setEditingCustom(false)
    setOpen(false)
  }

  const label = match.transmission_type === 'studio' ? '🎥 Estudio'
    : match.transmission_type === 'home' ? '🏠 Casa'
    : `✍️ ${match.custom_transmission_text || 'Personalizado'}`

  const color = match.transmission_type === 'studio' ? 'text-gold-400'
    : match.transmission_type === 'home' ? 'text-blue-400'
    : 'text-purple-400'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setEditingCustom(false) }}
        className={`text-xs font-medium ${color} hover:opacity-80 transition-opacity text-left max-w-[130px] truncate`}
        title={label}
      >
        {label} ▾
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-30 bg-navy-800 border border-white/10 rounded-xl shadow-2xl p-2 min-w-[190px]">
          {TRANS_OPTIONS.map(opt => (
            <button
              key={opt.val}
              onClick={() => select(opt.val)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-colors ${match.transmission_type === opt.val ? 'text-gold-400 font-bold' : 'text-white/70'}`}
            >
              {opt.label}
            </button>
          ))}
          {editingCustom && (
            <div className="px-2 pt-2 border-t border-white/5 mt-1 space-y-1">
              <input
                autoFocus
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveCustom()}
                className="w-full bg-navy-900 border border-gold-500/30 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none"
                placeholder="Descripción..."
              />
              <button onClick={saveCustom} className="w-full py-1.5 gold-gradient text-navy-950 font-bold text-xs rounded-lg">
                Guardar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Close Match Panel ─────────────────────────────────────────
function CloseMatchPanel({ match, onClose, onSaved, onClosed }) {
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // local copy of statuses to edit before saving
  const [statuses, setStatuses] = useState({})

  useEffect(() => { loadRegs() }, [])

  const loadRegs = async () => {
    setLoading(true)
    const data = await regStore.getByMatch(match.id)
    const active = data.filter(r => !['cancelled'].includes(r.status))
    setRegs(active)
    const s = {}
    active.forEach(r => { s[r.id] = r.status })
    setStatuses(s)
    setLoading(false)
  }

  const mainRegs = regs.filter(r => ['solo', 'duo'].includes(r.registration_type))
  const waitingRegs = regs.filter(r => ['waiting_solo', 'waiting_duo'].includes(r.registration_type))

  const setStatus = (id, status) => setStatuses(prev => ({ ...prev, [id]: status }))

  const confirmAll = () => {
    const next = {}
    regs.forEach(r => { next[r.id] = 'confirmed' })
    setStatuses(next)
  }

  const saveAll = async () => {
    setSaving(true)
    for (const r of regs) {
      if (statuses[r.id] !== r.status) {
        await regStore.update(r.id, { status: statuses[r.id] })
      }
    }
    setSaving(false)
    onSaved()
  }

  const closeTransmission = async () => {
    setSaving(true)
    for (const r of regs) {
      if (statuses[r.id] !== r.status) {
        await regStore.update(r.id, { status: statuses[r.id] })
      }
    }
    await matchStore.update(match.id, { status: 'closed' })
    setSaving(false)
    onClosed()
  }

  const confirmedCount = Object.values(statuses).filter(s => s === 'confirmed').length

  const typeLabel = { solo: 'Solo', duo: 'Con dupla', waiting_solo: 'Espera solo', waiting_duo: 'Espera dupla' }
  const statusColor = {
    pending:   'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-green-500/20 text-green-400',
    waiting:   'bg-blue-500/20 text-blue-400',
    rejected:  'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              🔒 Cerrar transmisión
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              {match.flag_a} {match.team_a} vs {match.team_b} {match.flag_b}
              {match.match_date && <span className="ml-2">· {match.match_date} {match.match_time}</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match info bar */}
        <div className="px-5 py-3 bg-navy-800/50 border-b border-white/5 flex flex-wrap gap-4 text-xs shrink-0">
          <span className="text-white/50">Fase: <span className="text-white">{match.phase}</span></span>
          <span className="text-white/50">Lugar:
            <span className="text-gold-400 ml-1">
              {match.transmission_type === 'studio' ? '🎥 Estudio' : match.transmission_type === 'home' ? '🏠 Casa' : `✍️ ${match.custom_transmission_text}`}
            </span>
          </span>
          {confirmedCount > 0 && (
            <span className="text-green-400 font-semibold">✓ {confirmedCount} confirmados</span>
          )}
        </div>

        {/* Participants list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-white/30">Cargando inscritos...</div>
          ) : regs.length === 0 ? (
            <div className="text-center py-8 text-white/30">
              <p className="text-3xl mb-2">📋</p>
              <p>No hay inscritos en este partido</p>
              <p className="text-xs mt-1 text-white/20">Puedes cerrarlo igual</p>
            </div>
          ) : (
            <>
              {/* Confirm all button */}
              {mainRegs.length > 0 && (
                <button
                  onClick={confirmAll}
                  className="w-full py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm rounded-xl hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Confirmar todos ({regs.length})
                </button>
              )}

              {/* Main participants */}
              {mainRegs.length > 0 && (
                <div>
                  <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">🎙️ Postulantes principales</p>
                  <div className="space-y-2">
                    {mainRegs.map((r, i) => (
                      <div key={r.id} className="flex items-center justify-between gap-3 bg-navy-800 rounded-xl p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-white/30 text-xs w-5 shrink-0">{i + 1}.</span>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{r.reacter_name || r.reacter_id}</p>
                            <p className="text-white/30 text-xs">{typeLabel[r.registration_type]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setStatus(r.id, 'confirmed')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statuses[r.id] === 'confirmed' ? 'bg-green-500/30 text-green-300 ring-1 ring-green-500/50' : 'bg-white/5 text-white/40 hover:bg-green-500/20 hover:text-green-400'}`}
                          >
                            ✓ Confirmar
                          </button>
                          <button
                            onClick={() => setStatus(r.id, 'waiting')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statuses[r.id] === 'waiting' ? 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-500/50' : 'bg-white/5 text-white/40 hover:bg-blue-500/20 hover:text-blue-400'}`}
                          >
                            Espera
                          </button>
                          <button
                            onClick={() => setStatus(r.id, 'rejected')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statuses[r.id] === 'rejected' ? 'bg-red-500/30 text-red-300 ring-1 ring-red-500/50' : 'bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-400'}`}
                          >
                            ✗ No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waiting list */}
              {waitingRegs.length > 0 && (
                <div>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">⏳ Lista de espera</p>
                  <div className="space-y-2">
                    {waitingRegs.map((r, i) => (
                      <div key={r.id} className="flex items-center justify-between gap-3 bg-navy-800/60 border border-blue-500/10 rounded-xl p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-white/20 text-xs w-5 shrink-0">{i + 1}.</span>
                          <div className="min-w-0">
                            <p className="text-white/70 text-sm truncate">{r.reacter_name || r.reacter_id}</p>
                            <p className="text-white/20 text-xs">{typeLabel[r.registration_type]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setStatus(r.id, 'confirmed')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statuses[r.id] === 'confirmed' ? 'bg-green-500/30 text-green-300 ring-1 ring-green-500/50' : 'bg-white/5 text-white/40 hover:bg-green-500/20 hover:text-green-400'}`}
                          >
                            ✓ Confirmar
                          </button>
                          <button
                            onClick={() => setStatus(r.id, 'rejected')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statuses[r.id] === 'rejected' ? 'bg-red-500/30 text-red-300 ring-1 ring-red-500/50' : 'bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-400'}`}
                          >
                            ✗ No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="p-5 border-t border-white/5 shrink-0">
          {confirmedCount > 0 && (
            <p className="text-center text-green-400 text-xs mb-3 font-medium">
              ✓ {confirmedCount} participante{confirmedCount !== 1 ? 's' : ''} confirmado{confirmedCount !== 1 ? 's' : ''} para transmisión
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
            >
              Volver
            </button>
            <button
              onClick={saveAll}
              disabled={saving}
              className="flex-1 py-3 bg-navy-700 border border-white/10 hover:bg-navy-600 text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? '...' : 'Guardar'}
            </button>
            <button
              onClick={closeTransmission}
              disabled={saving}
              className="flex-1 py-3 bg-orange-500/20 border border-orange-500/30 hover:bg-orange-500/30 text-orange-300 font-bold rounded-xl transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {saving ? '...' : 'Cerrar transmisión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Status Chip ────────────────────────────────────────────────
function StatusChip({ status }) {
  const s = STATUSES[status] || STATUSES.disabled
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
      {s.label}
    </span>
  )
}

// ── Main Component ─────────────────────────────────────────────
export default function MatchesAdmin() {
  const [list, setList] = useState([])
  const [regCounts, setRegCounts] = useState({}) // { matchId: { main, waiting } }
  const [modal, setModal] = useState(null)
  const [closePanel, setClosePanel] = useState(null) // match object to show in CloseMatchPanel
  const [search, setSearch] = useState('')
  const [filterPhase, setFilterPhase] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const csvRef = useRef()

  useEffect(() => { load() }, [])

  const load = async () => {
    const [ms, allRegs] = await Promise.all([
      matchStore.getAll(),
      regStore.getAll(),
    ])
    setList(ms)
    // Compute counts from single query — no 208 API calls
    const counts = {}
    for (const m of ms) {
      const regs = allRegs.filter(r => r.match_id === m.id)
      counts[m.id] = {
        main: regs.filter(r => ['solo','duo'].includes(r.registration_type) && !['cancelled','rejected'].includes(r.status)).length,
        waiting: regs.filter(r => ['waiting_solo','waiting_duo'].includes(r.registration_type) && !['cancelled','rejected'].includes(r.status)).length,
      }
    }
    setRegCounts(counts)
  }

  const handleSave = async (form) => {
    if (modal === 'new') await matchStore.create(form)
    else await matchStore.update(modal.id, form)
    setModal(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar partido?')) return
    await matchStore.delete(id)
    load()
  }

  const handleToggleEnable = async (m) => {
    // Toggle between 'active' and 'disabled'
    const next = m.status === 'disabled' ? 'active' : 'disabled'
    await matchStore.update(m.id, { status: next })
    load()
  }

  const handleCloseInscriptions = async (m) => {
    if (!window.confirm(`¿Cerrar inscripciones para ${m.team_a} vs ${m.team_b}?`)) return
    await matchStore.update(m.id, { status: 'closed' })
    load()
  }

  const handleReopenInscriptions = async (m) => {
    await matchStore.update(m.id, { status: 'active' })
    load()
  }

  const handleStatusChange = async (id, next) => {
    await matchStore.update(id, { status: next })
    load()
  }

  const handleTransmissionChange = async (id, data) => {
    await matchStore.update(id, data)
    load()
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(list.map(m => ({
      'Equipo A': m.team_a, 'Equipo B': m.team_b,
      'Bandera A': m.flag_a, 'Bandera B': m.flag_b,
      Fecha: m.match_date, Hora: m.match_time,
      Fase: m.phase, Transmisión: m.transmission_type,
      'Texto personalizado': m.custom_transmission_text,
      Estado: m.status, Notas: m.notes,
      Inscritos: regCounts[m.id]?.main || 0,
      Espera: regCounts[m.id]?.waiting || 0,
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Partidos')
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    saveAs(new Blob([buf]), 'partidos-mundial-2026.xlsx')
  }

  const handleImportCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const lines = ev.target.result.split('\n').filter(Boolean)
      const headers = lines[0].split(',').map(h => h.trim())
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',')
        return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || '').trim()]))
      })
      await matchStore.importMany(rows.map(r => ({
        team_a: r.team_a || r['Equipo A'] || '',
        team_b: r.team_b || r['Equipo B'] || '',
        flag_a: r.flag_a || r['Bandera A'] || '🏳️',
        flag_b: r.flag_b || r['Bandera B'] || '🏳️',
        match_date: r.match_date || r['Fecha'] || '',
        match_time: r.match_time || r['Hora'] || '',
        phase: r.phase || r['Fase'] || '',
        transmission_type: r.transmission_type || 'studio',
        status: 'disabled',
        notes: r.notes || r['Notas'] || '',
      })))
      load()
      alert('Importación completada')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const phases = ['all', ...new Set(list.map(m => m.phase))]
  const filtered = list.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.team_a.toLowerCase().includes(q) || m.team_b.toLowerCase().includes(q)
    const matchPhase = filterPhase === 'all' || m.phase === filterPhase
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchPhase && matchStatus
  })

  // Stats summary
  const activeCount = list.filter(m => m.status === 'active').length
  const closedCount = list.filter(m => m.status === 'closed').length
  const readyCount = list.filter(m => m.status === 'active' && (regCounts[m.id]?.main || 0) >= 2).length

  return (
    <div className="p-4 md:p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">⚽ Partidos</h1>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-white/40">
            <span>{list.length} total</span>
            <span className="text-green-400">{activeCount} abiertos</span>
            {readyCount > 0 && <span className="text-gold-400">🟢 {readyCount} listos para cerrar</span>}
            {closedCount > 0 && <span className="text-orange-400">🔒 {closedCount} cerrados</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input type="file" accept=".csv" ref={csvRef} onChange={handleImportCSV} className="hidden" />
          <button onClick={() => csvRef.current.click()} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm transition-colors">
            <Upload className="w-4 h-4" /> CSV
          </button>
          <button onClick={exportExcel} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm transition-colors">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => setModal('new')} className="flex items-center gap-1.5 px-4 py-2 gold-gradient text-navy-950 font-bold rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar equipos..." className="w-full bg-navy-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500" />
        </div>
        <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)} className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
          <option value="all">Todas las fases</option>
          {phases.filter(p => p !== 'all').map(p => <option key={p} value={p}>{p.replace('Fase de Grupos - ', 'Grupo ')}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
          <option value="all">Todos los estados</option>
          {Object.entries(STATUSES).map(([val, info]) => (
            <option key={val} value={val}>{info.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-navy-900/50">
                <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">Partido</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">Fecha / Hora</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap hidden lg:table-cell">Fase</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">Lugar transmisión</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">Inscritos</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">Estado</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const cnt = regCounts[m.id] || { main: 0, waiting: 0 }
                const isReady = m.status === 'active' && cnt.main >= 2
                const isOpen = m.status === 'active'
                const isClosed = ['closed', 'confirmed', 'finished'].includes(m.status)
                const isDisabled = m.status === 'disabled'

                return (
                  <tr key={m.id} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                    {/* Match */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-base">{m.flag_a}</span>
                        <span className="text-white font-medium text-xs">{m.team_a}</span>
                        <span className="text-white/20 text-xs">vs</span>
                        <span className="text-white font-medium text-xs">{m.team_b}</span>
                        <span className="text-base">{m.flag_b}</span>
                      </div>
                      {isReady && (
                        <div className="mt-1">
                          <span className="text-xs text-green-400 font-medium">🟢 Listo para cerrar</span>
                        </div>
                      )}
                    </td>

                    {/* Date/Time */}
                    <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">
                      <div>{m.match_date || '—'}</div>
                      <div className="text-white/30">{m.match_time || ''}</div>
                    </td>

                    {/* Phase */}
                    <td className="px-4 py-3 text-white/40 hidden lg:table-cell text-xs whitespace-nowrap">
                      {m.phase?.replace('Fase de Grupos - ', '')}
                    </td>

                    {/* Transmission — inline editable */}
                    <td className="px-4 py-3">
                      <TransmissionCell match={m} onChange={handleTransmissionChange} />
                    </td>

                    {/* Inscribed count */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs">
                        <span className={`font-medium ${cnt.main >= 2 ? 'text-green-400' : cnt.main > 0 ? 'text-white/60' : 'text-white/20'}`}>
                          {cnt.main} inscritos
                        </span>
                        {cnt.waiting > 0 && (
                          <div className="text-yellow-400 mt-0.5">{cnt.waiting} espera</div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusChip status={m.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 flex-nowrap">
                        {/* Enable / Disable toggle (only for disabled/active) */}
                        {!isClosed && (
                          <button
                            onClick={() => handleToggleEnable(m)}
                            title={isOpen ? 'Deshabilitar' : 'Habilitar'}
                            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            {isOpen
                              ? <ToggleRight className="w-5 h-5 text-green-400" />
                              : <ToggleLeft className="w-5 h-5 text-white/30" />
                            }
                          </button>
                        )}

                        {/* Close inscriptions button (active only) — opens panel */}
                        {isOpen && (
                          <button
                            onClick={() => setClosePanel(m)}
                            title="Gestionar y cerrar transmisión"
                            className="p-1.5 rounded-lg hover:bg-orange-500/10 text-orange-400/60 hover:text-orange-400 transition-colors"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Reopen (closed only) */}
                        {m.status === 'closed' && (
                          <button
                            onClick={() => handleReopenInscriptions(m)}
                            title="Reabrir inscripciones"
                            className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400/60 hover:text-green-400 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit */}
                        <button onClick={() => setModal(m)} className="p-1.5 text-white/40 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/5">
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-white/30">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/30">
        <span><span className="text-green-400">Toggle</span> = habilitar/deshabilitar partido</span>
        <span><span className="text-orange-400">🔒</span> = cerrar inscripciones</span>
        <span><span className="text-green-400">🟢 Listo para cerrar</span> = partido con 2+ inscritos</span>
      </div>

      {modal !== null && (
        <MatchModal
          match={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {closePanel !== null && (
        <CloseMatchPanel
          match={closePanel}
          onClose={() => setClosePanel(null)}
          onSaved={() => { setClosePanel(null); load() }}
          onClosed={() => { setClosePanel(null); load() }}
        />
      )}
    </div>
  )
}

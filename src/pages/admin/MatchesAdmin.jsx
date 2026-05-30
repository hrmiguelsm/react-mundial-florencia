import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Download, Upload, X, Search, Lock, CheckCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { matches as matchStore, registrations as regStore } from '../../lib/demoStorage.js'

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
          {/* Status */}
          <div>
            <label className="block text-xs text-white/50 mb-2">Estado</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUSES).map(([val, info]) => (
                <label key={val} className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border transition-colors ${form.status === val ? 'border-gold-500/50 bg-gold-500/5' : 'border-white/5 hover:border-white/10'}`}>
                  <input type="radio" name="status" value={val} checked={form.status === val} onChange={() => s('status', val)} className="accent-gold-500" />
                  <span className={`text-sm ${info.color}`}>{info.label}</span>
                </label>
              ))}
            </div>
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
  const [search, setSearch] = useState('')
  const [filterPhase, setFilterPhase] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const csvRef = useRef()

  useEffect(() => { load() }, [])

  const load = () => {
    const ms = matchStore.getAll()
    setList(ms)
    // Compute registration counts per match
    const counts = {}
    for (const m of ms) {
      counts[m.id] = {
        main: regStore.countMain(m.id),
        waiting: regStore.countWaiting(m.id),
      }
    }
    setRegCounts(counts)
  }

  const handleSave = (form) => {
    if (modal === 'new') matchStore.create(form)
    else matchStore.update(modal.id, form)
    setModal(null)
    load()
  }

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar partido?')) return
    matchStore.delete(id)
    load()
  }

  const handleToggleEnable = (m) => {
    // Toggle between 'active' and 'disabled'
    const next = m.status === 'disabled' ? 'active' : 'disabled'
    matchStore.update(m.id, { status: next })
    load()
  }

  const handleCloseInscriptions = (m) => {
    if (!window.confirm(`¿Cerrar inscripciones para ${m.team_a} vs ${m.team_b}?`)) return
    matchStore.update(m.id, { status: 'closed' })
    load()
  }

  const handleReopenInscriptions = (m) => {
    matchStore.update(m.id, { status: 'active' })
    load()
  }

  const handleStatusChange = (id, next) => {
    matchStore.update(id, { status: next })
    load()
  }

  const handleTransmissionChange = (id, data) => {
    matchStore.update(id, data)
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
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(Boolean)
      const headers = lines[0].split(',').map(h => h.trim())
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',')
        return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || '').trim()]))
      })
      matchStore.importMany(rows.map(r => ({
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
                        {cnt.main > 0 ? (
                          <span className={`font-medium ${cnt.main >= 2 ? 'text-green-400' : 'text-white/60'}`}>
                            {cnt.main} inscritos
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
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

                        {/* Close inscriptions button (active only) */}
                        {isOpen && (
                          <button
                            onClick={() => handleCloseInscriptions(m)}
                            title="Cerrar inscripciones"
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
    </div>
  )
}

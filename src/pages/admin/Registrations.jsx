import React, { useState, useEffect } from 'react'
import { Search, Download, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { registrations as regStore, matches as matchStore, reacters as reacterStore } from '../../lib/demoStorage.js'

const STATUS_OPTIONS = ['pending', 'confirmed', 'waiting', 'rejected', 'cancelled']
const STATUS_LABELS = {
  pending:   'Pendiente',
  confirmed: 'Confirmado ✓',
  waiting:   'En espera',
  rejected:  'No seleccionado',
  cancelled: 'Cancelado',
}
const STATUS_COLORS = {
  pending:   'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-green-500/20 text-green-400',
  waiting:   'bg-blue-500/20 text-blue-400',
  rejected:  'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-400',
}
const TYPE_LABELS = {
  solo:         '🎙️ Solo',
  duo:          '👥 Con dupla',
  waiting_solo: '⏳ Espera solo',
  waiting_duo:  '⏳ Espera dupla',
}

// ── Match group section ───────────────────────────────────────
function MatchSection({ match, regs, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(true)
  const main = regs.filter(r => ['solo', 'duo'].includes(r.registration_type) && !['cancelled', 'rejected'].includes(r.status))
  const waiting = regs.filter(r => ['waiting_solo', 'waiting_duo'].includes(r.registration_type) && !['cancelled', 'rejected'].includes(r.status))

  const handleSelectForTransmission = (regId) => {
    onStatusChange(regId, 'confirmed')
  }

  return (
    <div className="bg-navy-800 border border-white/5 rounded-2xl overflow-hidden mb-4">
      {/* Match header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{match.flag_a}</span>
          <span className="text-white font-bold text-sm">{match.team_a} vs {match.team_b}</span>
          <span className="text-xl">{match.flag_b}</span>
          <span className="text-white/30 text-xs hidden sm:inline">{match.match_date} {match.match_time}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            {main.length > 0 && <span className="text-green-400 font-medium">{main.length} postulantes</span>}
            {waiting.length > 0 && <span className="text-blue-400">{waiting.length} espera</span>}
            {main.length === 0 && waiting.length === 0 && <span className="text-white/20">Sin inscritos</span>}
          </div>
          <span className="text-white/30 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && regs.length > 0 && (
        <div className="border-t border-white/5">
          {/* Main participants */}
          {main.length > 0 && (
            <div className="px-5 py-3">
              <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-3">🎙️ Postulantes principales</p>
              <div className="space-y-2">
                {main.map(r => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-navy-900/60 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-white text-sm font-medium">{r.reacterName}</p>
                        <p className="text-white/30 text-xs">{r.reacterEmail}{r.reacterPhone ? ` · ${r.reacterPhone}` : ''}</p>
                        {r.hasDuo && <p className="text-gold-400/60 text-xs mt-0.5">👥 {r.duoName || 'Tiene dupla'}</p>}
                        <p className="text-white/20 text-xs">{TYPE_LABELS[r.registration_type]} · {r.created_at ? new Date(r.created_at).toLocaleDateString('es-CL') : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Quick action buttons */}
                      <button
                        onClick={() => handleSelectForTransmission(r.id)}
                        title="Seleccionar para transmisión"
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-400/60 hover:bg-green-500/20 hover:text-green-400'}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {r.status === 'confirmed' ? '✓ Confirmado' : 'Confirmar'}
                      </button>
                      <button
                        onClick={() => onStatusChange(r.id, 'waiting')}
                        title="Pasar a espera"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400/60 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onStatusChange(r.id, 'rejected')}
                        title="No seleccionado"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                      {/* Status dropdown for fine control */}
                      <select
                        value={r.status}
                        onChange={e => onStatusChange(r.id, e.target.value)}
                        className="bg-navy-800 border border-white/10 rounded-lg px-2 py-1 text-white/60 text-xs focus:outline-none focus:border-gold-500"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-navy-800">{STATUS_LABELS[s]}</option>)}
                      </select>
                      <button
                        onClick={() => { if (window.confirm('¿Eliminar inscripción?')) onDelete(r.id) }}
                        className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waiting list */}
          {waiting.length > 0 && (
            <div className={`px-5 py-3 ${main.length > 0 ? 'border-t border-white/5' : ''}`}>
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-3">⏳ Lista de espera ({waiting.length}/6)</p>
              <div className="space-y-2">
                {waiting.map((r, i) => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-blue-900/10 border border-blue-500/10 rounded-xl">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{i + 1}. {r.reacterName}</p>
                      <p className="text-white/30 text-xs">{r.reacterEmail}</p>
                      <p className="text-white/20 text-xs">{TYPE_LABELS[r.registration_type]}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSelectForTransmission(r.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400/60 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Confirmar
                      </button>
                      <select
                        value={r.status}
                        onChange={e => onStatusChange(r.id, e.target.value)}
                        className="bg-navy-800 border border-white/10 rounded-lg px-2 py-1 text-white/60 text-xs focus:outline-none"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-navy-800">{STATUS_LABELS[s]}</option>)}
                      </select>
                      <button
                        onClick={() => { if (window.confirm('¿Eliminar?')) onDelete(r.id) }}
                        className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled / rejected collapsed */}
          {regs.filter(r => ['cancelled', 'rejected'].includes(r.status)).length > 0 && (
            <div className="px-5 py-2 border-t border-white/5">
              <p className="text-xs text-white/20">
                + {regs.filter(r => ['cancelled', 'rejected'].includes(r.status)).length} cancelados/rechazados
              </p>
            </div>
          )}
        </div>
      )}

      {open && regs.length === 0 && (
        <div className="px-5 py-6 text-center text-white/20 text-sm border-t border-white/5">
          Sin inscripciones en este partido
        </div>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────
export default function Registrations() {
  const [regs, setRegs] = useState([])
  const [allMatches, setAllMatches] = useState([])
  const [allReacters, setAllReacters] = useState([])
  const [search, setSearch] = useState('')
  const [filterMatch, setFilterMatch] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [view, setView] = useState('byMatch') // 'byMatch' | 'table'

  useEffect(() => {
    setAllMatches(matchStore.getAll())
    setAllReacters(reacterStore.getAll())
    load()
  }, [])

  const load = () => setRegs(regStore.getAll())

  const handleStatusChange = (id, status) => {
    regStore.update(id, { status })
    load()
  }

  const handleDelete = (id) => {
    regStore.delete(id)
    load()
  }

  const getReacterInfo = (reg) => {
    const r = allReacters.find(r => r.id === reg.reacter_id)
    return {
      name: r?.name || reg.reacter_name || reg.reacter_id,
      email: r?.email || '',
      phone: r?.phone || '',
      hasDuo: r?.has_duo,
      duoName: r?.duo_name,
    }
  }

  const enriched = regs.map(r => {
    const info = getReacterInfo(r)
    const m = allMatches.find(m => m.id === r.match_id)
    return {
      ...r,
      reacterName: info.name,
      reacterEmail: info.email,
      reacterPhone: info.phone,
      hasDuo: info.hasDuo,
      duoName: info.duoName,
      matchLabel: m ? `${m.flag_a} ${m.team_a} vs ${m.team_b} ${m.flag_b}` : r.match_id,
      matchObj: m,
    }
  })

  const filtered = enriched.filter(r => {
    const q = search.toLowerCase()
    const ms = !q || r.reacterName?.toLowerCase().includes(q) || r.matchLabel?.toLowerCase().includes(q)
    const mm = filterMatch === 'all' || r.match_id === filterMatch
    const mst = filterStatus === 'all' || r.status === filterStatus
    return ms && mm && mst
  })

  // Group by match for byMatch view
  const matchesWithRegs = allMatches
    .filter(m => filterMatch === 'all' || m.id === filterMatch)
    .map(m => ({
      match: m,
      regs: filtered.filter(r => r.match_id === m.id),
    }))
    .filter(g => g.regs.length > 0 || filterMatch === g.match.id)

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(enriched.map(r => ({
      Nombre: r.reacterName, Email: r.reacterEmail, Teléfono: r.reacterPhone,
      Partido: r.matchLabel,
      Tipo: TYPE_LABELS[r.registration_type] || r.registration_type,
      Estado: STATUS_LABELS[r.status] || r.status,
      Observaciones: r.observations || '',
      Fecha: r.created_at ? new Date(r.created_at).toLocaleDateString('es-CL') : '',
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inscripciones')
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'inscripciones.xlsx')
  }

  const confirmedCount = regs.filter(r => r.status === 'confirmed').length
  const pendingCount = regs.filter(r => r.status === 'pending').length
  const waitingCount = regs.filter(r => r.status === 'waiting').length

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">📋 Inscripciones</h1>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-white/40">
            <span>{regs.length} total</span>
            {confirmedCount > 0 && <span className="text-green-400">✓ {confirmedCount} confirmados</span>}
            {pendingCount > 0 && <span className="text-yellow-400">{pendingCount} pendientes</span>}
            {waitingCount > 0 && <span className="text-blue-400">{waitingCount} en espera</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView(view === 'byMatch' ? 'table' : 'byMatch')} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm transition-colors">
            {view === 'byMatch' ? '📊 Ver tabla' : '🗂 Ver por partido'}
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm transition-colors">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre o partido..." className="w-full bg-navy-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500" />
        </div>
        <select value={filterMatch} onChange={e => setFilterMatch(e.target.value)} className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
          <option value="all">Todos los partidos</option>
          {allMatches.map(m => <option key={m.id} value={m.id}>{m.flag_a} {m.team_a} vs {m.team_b}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* By-Match view */}
      {view === 'byMatch' && (
        <div>
          {matchesWithRegs.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <p className="text-4xl mb-3">📋</p>
              <p>Sin inscripciones que mostrar</p>
            </div>
          ) : (
            matchesWithRegs.map(({ match, regs: mRegs }) => (
              <MatchSection
                key={match.id}
                match={match}
                regs={mRegs}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="bg-navy-800 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Reacter</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Partido</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium hidden xl:table-cell">Fecha</th>
                  <th className="text-right px-4 py-3 text-white/40 font-medium">Acc.</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{r.reacterName}</p>
                      <p className="text-white/30 text-xs">{r.reacterEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-white/60 hidden md:table-cell text-xs">{r.matchLabel}</td>
                    <td className="px-4 py-3 text-white/50 hidden lg:table-cell text-xs">{TYPE_LABELS[r.registration_type]}</td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={e => handleStatusChange(r.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border border-white/5 outline-none cursor-pointer ${STATUS_COLORS[r.status] || 'bg-white/10 text-white/50'}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-navy-800 text-white">{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs hidden xl:table-cell">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('es-CL') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { if (window.confirm('¿Eliminar?')) handleDelete(r.id) }} className="p-1 text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-white/30">Sin inscripciones</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

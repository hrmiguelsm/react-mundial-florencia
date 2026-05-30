import React, { useState, useEffect } from 'react'
import { Search, Download, Eye, X, Users } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { reacters as reacterStore } from '../../lib/demoStorage.js'

function ReacterModal({ reacter, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Detalle Reacter</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          <Row label="RUT" value={reacter.rut} mono />
          <Row label="Nombre" value={reacter.name} />
          <Row label="Email" value={reacter.email} />
          <Row label="Teléfono" value={reacter.phone} />
          <Row label="Tiene dupla" value={reacter.has_duo ? 'Sí' : 'No'} />
          {reacter.has_duo && (
            <div className="pl-4 border-l-2 border-gold-500/30 space-y-2 mt-2">
              <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">Dupla</p>
              <Row label="Nombre" value={reacter.duo_name} />
              <Row label="RUT" value={reacter.duo_rut} mono />
              <Row label="Email" value={reacter.duo_email} />
              <Row label="Teléfono" value={reacter.duo_phone} />
            </div>
          )}
          <Row label="Registrado" value={reacter.created_at ? new Date(reacter.created_at).toLocaleDateString('es-CL') : '—'} />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-white/40 text-sm w-28 shrink-0">{label}</span>
      <span className={`text-white text-sm break-all ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  )
}

export default function ReactersAdmin() {
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { setList(reacterStore.getAll()) }, [])

  const filtered = list.filter(r => {
    const q = search.toLowerCase()
    return !q || r.name?.toLowerCase().includes(q) || r.rut?.includes(q) || r.email?.toLowerCase().includes(q)
  })

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(list.map(r => ({
      RUT: r.rut, Nombre: r.name, Email: r.email, Teléfono: r.phone,
      'Tiene Dupla': r.has_duo ? 'Sí' : 'No',
      'Nombre Dupla': r.duo_name || '',
      'RUT Dupla': r.duo_rut || '',
      'Email Dupla': r.duo_email || '',
      'Teléfono Dupla': r.duo_phone || '',
      'Fecha Registro': r.created_at ? new Date(r.created_at).toLocaleDateString('es-CL') : '',
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reacters')
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'reacters.xlsx')
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Reacters</h1>
          <p className="text-white/40 text-sm">{list.length} registrados</p>
        </div>
        <button onClick={exportExcel} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm transition-colors">
          <Download className="w-4 h-4" /> Excel
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, RUT o email..." className="w-full bg-navy-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500" />
      </div>

      <div className="bg-navy-800 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">RUT</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Teléfono</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Dupla</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Ver</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-white/60 font-mono text-xs">{r.rut}</td>
                  <td className="px-4 py-3 text-white/60 hidden md:table-cell">{r.email}</td>
                  <td className="px-4 py-3 text-white/60 hidden lg:table-cell">{r.phone}</td>
                  <td className="px-4 py-3">
                    {r.has_duo
                      ? <span className="flex items-center gap-1 text-gold-400 text-xs"><Users className="w-3.5 h-3.5" /> {r.duo_name}</span>
                      : <span className="text-white/20 text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(r)} className="p-1.5 text-white/40 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/5">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">Sin reacters registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <ReacterModal reacter={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Download, Upload, Search, X } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { authorizedUsers } from '../../lib/demoStorage.js'
import { formatRut, cleanRut, validateRut } from '../../utils/rut.js'

function AddModal({ onClose, onAdd }) {
  const [rut, setRut] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleRut = (e) => {
    const c = e.target.value.replace(/[^0-9kK]/g, '')
    setRut(c.length > 0 ? formatRut(c) : '')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = cleanRut(rut)
    if (!validateRut(cleaned)) { setError('RUT inválido'); return }
    try {
      onAdd(formatRut(cleaned), name.trim())
      onClose()
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Agregar RUT</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1">RUT *</label>
            <input value={rut} onChange={handleRut} placeholder="12.345.678-9" maxLength={12}
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-gold-500" autoFocus />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre Apellido"
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 gold-gradient text-navy-950 font-bold rounded-xl text-sm">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AuthorizedRuts() {
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const csvRef = useRef()

  useEffect(() => { load() }, [])
  const load = () => setList(authorizedUsers.getAll())

  const handleAdd = (rut, name) => {
    authorizedUsers.add(rut, name)
    load()
  }

  const handleToggle = (id) => { authorizedUsers.toggleStatus(id); load() }
  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar RUT?')) return
    authorizedUsers.delete(id)
    load()
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(list.map(u => ({ RUT: u.rut, Nombre: u.name, Email: u.email || '', Teléfono: u.phone || '', Estado: u.status })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'RUTs')
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'ruts-autorizados.xlsx')
  }

  const handleImportCSV = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(Boolean)
      const items = lines.slice(1).map(l => {
        const [rut, name] = l.split(',').map(s => s.trim())
        return { rut, name: name || '' }
      }).filter(i => i.rut)
      authorizedUsers.importMany(items)
      load()
      alert('Importación completada')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const filtered = list.filter(u => {
    const q = search.toLowerCase()
    return !q || u.rut?.includes(q) || u.name?.toLowerCase().includes(q)
  })

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">RUT Autorizados</h1>
          <p className="text-white/40 text-sm">{list.length} total · {list.filter(u => u.status === 'enabled').length} habilitados</p>
        </div>
        <div className="flex gap-2">
          <input type="file" accept=".csv" ref={csvRef} onChange={handleImportCSV} className="hidden" />
          <button onClick={() => csvRef.current.click()} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm">
            <Upload className="w-4 h-4" /> CSV
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 gold-gradient text-navy-950 font-bold rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por RUT o nombre..." className="w-full bg-navy-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500" />
      </div>

      <div className="bg-navy-800 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/40 font-medium">RUT</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Contacto</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Estado</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white font-mono text-xs">{u.rut}</td>
                  <td className="px-4 py-3 text-white/80">{u.name || <span className="text-white/20 italic">Sin completar</span>}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-white/40">
                    {u.email && <div>{u.email}</div>}
                    {u.phone && <div>{u.phone}</div>}
                    {!u.email && !u.phone && <span className="text-white/20">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(u.id)} className="flex items-center gap-1.5">
                      {u.status === 'enabled'
                        ? <><ToggleRight className="w-5 h-5 text-green-400" /><span className="text-green-400 text-xs">Habilitado</span></>
                        : <><ToggleLeft className="w-5 h-5 text-red-400" /><span className="text-red-400 text-xs">Bloqueado</span></>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-white/30">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-3 bg-navy-800/50 rounded-xl border border-white/5 text-xs text-white/30">
        Formato CSV para importar: RUT,Nombre (una fila por línea, primera fila = encabezado)
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  )
}

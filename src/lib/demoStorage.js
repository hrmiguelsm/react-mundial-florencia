// Demo mode: all data lives in localStorage
import { worldCupMatches } from '../data/worldcupMatches.js'

const KEYS = {
  authorized_users: 'rmf_authorized_users',
  reacters: 'rmf_reacters',
  matches: 'rmf_matches',
  registrations: 'rmf_registrations',
  seeded: 'rmf_seeded',
}

function get(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

function seed() {
  if (localStorage.getItem(KEYS.seeded)) return
  set(KEYS.authorized_users, [
    { id: 'u1', rut: '12345678-9', name: 'Juan Pérez Demo', email: '', phone: '', status: 'enabled', created_at: new Date().toISOString() },
    { id: 'u2', rut: '98765432-1', name: 'María González Demo', email: '', phone: '', status: 'enabled', created_at: new Date().toISOString() },
    { id: 'u3', rut: '11111111-1', name: 'Carlos Soto Demo', email: '', phone: '', status: 'enabled', created_at: new Date().toISOString() },
  ])
  set(KEYS.matches, worldCupMatches.map(m => ({ ...m, created_at: new Date().toISOString() })))
  set(KEYS.reacters, [])
  set(KEYS.registrations, [])
  localStorage.setItem(KEYS.seeded, '1')
}

function uuid() {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// ── authorized_users ──────────────────────────────────────────
export const authorizedUsers = {
  getAll() { seed(); return get(KEYS.authorized_users) },
  getByRut(rut) { return this.getAll().find(u => u.rut === rut) || null },
  add(rut, name) {
    const users = this.getAll()
    if (users.find(u => u.rut === rut)) throw new Error('RUT ya existe')
    const nu = { id: uuid(), rut, name: name || '', email: '', phone: '', status: 'enabled', created_at: new Date().toISOString() }
    set(KEYS.authorized_users, [...users, nu])
    return nu
  },
  // Called when a reacter completes their profile — keeps authorized_users in sync
  updateProfile(rut, { name, email, phone }) {
    const users = this.getAll().map(u =>
      u.rut === rut ? { ...u, name: name || u.name, email: email || u.email, phone: phone || u.phone } : u
    )
    set(KEYS.authorized_users, users)
  },
  toggleStatus(id) {
    const users = this.getAll().map(u => u.id === id ? { ...u, status: u.status === 'enabled' ? 'blocked' : 'enabled' } : u)
    set(KEYS.authorized_users, users)
  },
  delete(id) { set(KEYS.authorized_users, this.getAll().filter(u => u.id !== id)) },
  update(id, data) {
    const users = this.getAll().map(u => u.id === id ? { ...u, ...data } : u)
    set(KEYS.authorized_users, users)
  },
  importMany(arr) {
    const existing = this.getAll()
    const merged = [...existing]
    for (const item of arr) {
      if (!merged.find(u => u.rut === item.rut)) {
        merged.push({ id: uuid(), rut: item.rut, name: item.name || '', email: item.email || '', phone: item.phone || '', status: 'enabled', created_at: new Date().toISOString() })
      }
    }
    set(KEYS.authorized_users, merged)
  }
}

// ── reacters ──────────────────────────────────────────────────
export const reacters = {
  getAll() { seed(); return get(KEYS.reacters) },
  getByRut(rut) { return this.getAll().find(r => r.rut === rut) || null },
  upsert(data) {
    const all = this.getAll()
    const idx = all.findIndex(r => r.rut === data.rut)
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data }
    } else {
      all.push({ id: uuid(), ...data, created_at: new Date().toISOString() })
    }
    set(KEYS.reacters, all)
    return this.getByRut(data.rut)
  },
  delete(id) { set(KEYS.reacters, this.getAll().filter(r => r.id !== id)) },
}

// ── matches ───────────────────────────────────────────────────
// status: 'disabled' | 'active' | 'closed' | 'confirmed' | 'finished'
export const matches = {
  getAll() { seed(); return get(KEYS.matches) },
  getById(id) { return this.getAll().find(m => m.id === id) || null },
  // Reacters see active + closed matches
  getVisible() { return this.getAll().filter(m => ['active', 'closed'].includes(m.status)) },
  getActive() { return this.getAll().filter(m => m.status === 'active') },
  create(data) {
    const all = this.getAll()
    const nm = { id: uuid(), ...data, created_at: new Date().toISOString() }
    set(KEYS.matches, [...all, nm])
    return nm
  },
  update(id, data) {
    const all = this.getAll().map(m => m.id === id ? { ...m, ...data } : m)
    set(KEYS.matches, all)
    return this.getById(id)
  },
  delete(id) { set(KEYS.matches, this.getAll().filter(m => m.id !== id)) },
  importMany(arr) {
    const existing = this.getAll()
    const merged = [...existing]
    for (const item of arr) {
      merged.push({ id: uuid(), ...item, created_at: new Date().toISOString() })
    }
    set(KEYS.matches, merged)
  }
}

// ── registrations ─────────────────────────────────────────────
export const registrations = {
  getAll() { seed(); return get(KEYS.registrations) },
  getByMatch(matchId) { return this.getAll().filter(r => r.match_id === matchId) },
  getByReacter(reacterId) { return this.getAll().filter(r => r.reacter_id === reacterId) },
  getByMatchAndReacter(matchId, reacterId) {
    return this.getAll().find(r => r.match_id === matchId && r.reacter_id === reacterId) || null
  },
  // Count main (non-waiting) active registrations for a match
  countMain(matchId) {
    return this.getByMatch(matchId).filter(r =>
      ['solo', 'duo'].includes(r.registration_type) &&
      !['cancelled', 'rejected'].includes(r.status)
    ).length
  },
  // Count waiting registrations for a match
  countWaiting(matchId) {
    return this.getByMatch(matchId).filter(r =>
      ['waiting_solo', 'waiting_duo'].includes(r.registration_type) &&
      !['cancelled', 'rejected'].includes(r.status)
    ).length
  },
  create(data) {
    const all = this.getAll()
    const exists = all.find(r => r.match_id === data.match_id && r.reacter_id === data.reacter_id)
    if (exists) throw new Error('Ya estás inscrito en este partido')
    const nr = { id: uuid(), ...data, created_at: new Date().toISOString() }
    set(KEYS.registrations, [...all, nr])
    return nr
  },
  update(id, data) {
    const all = this.getAll().map(r => r.id === id ? { ...r, ...data } : r)
    set(KEYS.registrations, all)
  },
  delete(id) { set(KEYS.registrations, this.getAll().filter(r => r.id !== id)) },
}

import { supabase, DEMO_MODE } from './supabase.js'
import * as demo from './demoStorage.js'

// Helper: wrap sync demo calls as promises
const p = (fn) => (...args) => Promise.resolve(fn(...args))

export const authorizedUsers = DEMO_MODE ? {
  getAll: p(demo.authorizedUsers.getAll.bind(demo.authorizedUsers)),
  getByRut: p(demo.authorizedUsers.getByRut.bind(demo.authorizedUsers)),
  add: p(demo.authorizedUsers.add.bind(demo.authorizedUsers)),
  updateProfile: p(demo.authorizedUsers.updateProfile.bind(demo.authorizedUsers)),
  toggleStatus: p(demo.authorizedUsers.toggleStatus.bind(demo.authorizedUsers)),
  delete: p(demo.authorizedUsers.delete.bind(demo.authorizedUsers)),
  update: p(demo.authorizedUsers.update.bind(demo.authorizedUsers)),
  importMany: p(demo.authorizedUsers.importMany.bind(demo.authorizedUsers)),
} : {
  getAll: async () => {
    const { data } = await supabase.from('authorized_users').select('*, reacters(name,email,phone)').order('created_at', { ascending: false })
    return (data || []).map(u => ({
      ...u,
      name: u.reacters?.name || u.name,
      email: u.reacters?.email || '',
      phone: u.reacters?.phone || '',
    }))
  },
  getByRut: async (rut) => {
    const { data } = await supabase.from('authorized_users').select('*').eq('rut', rut).maybeSingle()
    return data || null
  },
  add: async (rut, name) => {
    const { data, error } = await supabase.from('authorized_users').insert({ rut, name: name || '', status: 'enabled' }).select().single()
    if (error) throw new Error(error.message)
    return data
  },
  updateProfile: async (rut, { name }) => {
    await supabase.from('authorized_users').update({ name }).eq('rut', rut)
  },
  toggleStatus: async (id) => {
    const { data: user } = await supabase.from('authorized_users').select('status').eq('id', id).single()
    if (user) await supabase.from('authorized_users').update({ status: user.status === 'enabled' ? 'blocked' : 'enabled' }).eq('id', id)
  },
  delete: async (id) => {
    await supabase.from('authorized_users').delete().eq('id', id)
  },
  update: async (id, data) => {
    await supabase.from('authorized_users').update(data).eq('id', id)
  },
  importMany: async (arr) => {
    const rows = arr.map(item => ({ rut: item.rut, name: item.name || '', status: 'enabled' }))
    await supabase.from('authorized_users').upsert(rows, { onConflict: 'rut', ignoreDuplicates: true })
  },
}

export const reacters = DEMO_MODE ? {
  getAll: p(demo.reacters.getAll.bind(demo.reacters)),
  getByRut: p(demo.reacters.getByRut.bind(demo.reacters)),
  upsert: p(demo.reacters.upsert.bind(demo.reacters)),
  delete: p(demo.reacters.delete.bind(demo.reacters)),
} : {
  getAll: async () => {
    const { data } = await supabase.from('reacters').select('*').order('created_at', { ascending: false })
    return data || []
  },
  getByRut: async (rut) => {
    const { data } = await supabase.from('reacters').select('*').eq('rut', rut).maybeSingle()
    return data || null
  },
  upsert: async (data) => {
    const { data: existing } = await supabase.from('reacters').select('id').eq('rut', data.rut).maybeSingle()
    if (existing) {
      const { data: updated } = await supabase.from('reacters').update(data).eq('rut', data.rut).select().single()
      return updated
    } else {
      const { data: inserted } = await supabase.from('reacters').insert(data).select().single()
      return inserted
    }
  },
  delete: async (id) => {
    await supabase.from('reacters').delete().eq('id', id)
  },
}

export const matches = DEMO_MODE ? {
  getAll: p(demo.matches.getAll.bind(demo.matches)),
  getById: p(demo.matches.getById.bind(demo.matches)),
  getVisible: p(demo.matches.getVisible.bind(demo.matches)),
  create: p(demo.matches.create.bind(demo.matches)),
  update: p(demo.matches.update.bind(demo.matches)),
  delete: p(demo.matches.delete.bind(demo.matches)),
  importMany: p(demo.matches.importMany.bind(demo.matches)),
} : {
  getAll: async () => {
    const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).order('match_time', { ascending: true })
    return data || []
  },
  getById: async (id) => {
    const { data } = await supabase.from('matches').select('*').eq('id', id).single()
    return data || null
  },
  getVisible: async () => {
    const { data } = await supabase.from('matches').select('*').in('status', ['active', 'closed']).order('match_date').order('match_time')
    return data || []
  },
  create: async (data) => {
    const { data: inserted } = await supabase.from('matches').insert(data).select().single()
    return inserted
  },
  update: async (id, data) => {
    await supabase.from('matches').update(data).eq('id', id)
  },
  delete: async (id) => {
    await supabase.from('matches').delete().eq('id', id)
  },
  importMany: async (arr) => {
    await supabase.from('matches').insert(arr)
  },
}

export const registrations = DEMO_MODE ? {
  getAll: p(demo.registrations.getAll.bind(demo.registrations)),
  getByMatch: p(demo.registrations.getByMatch.bind(demo.registrations)),
  getByReacter: p(demo.registrations.getByReacter.bind(demo.registrations)),
  countMain: p(demo.registrations.countMain.bind(demo.registrations)),
  countWaiting: p(demo.registrations.countWaiting.bind(demo.registrations)),
  create: p(demo.registrations.create.bind(demo.registrations)),
  update: p(demo.registrations.update.bind(demo.registrations)),
  delete: p(demo.registrations.delete.bind(demo.registrations)),
} : {
  getAll: async () => {
    const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
    return data || []
  },
  getByMatch: async (matchId) => {
    const { data } = await supabase.from('registrations').select('*').eq('match_id', matchId).order('created_at')
    return data || []
  },
  getByReacter: async (reacterId) => {
    const { data } = await supabase.from('registrations').select('*').eq('reacter_id', reacterId)
    return data || []
  },
  countMain: async (matchId) => {
    const { data } = await supabase.from('registrations').select('id, status, registration_type')
      .eq('match_id', matchId)
      .in('registration_type', ['solo', 'duo'])
    return (data || []).filter(r => !['cancelled', 'rejected'].includes(r.status)).length
  },
  countWaiting: async (matchId) => {
    const { data } = await supabase.from('registrations').select('id, status, registration_type')
      .eq('match_id', matchId)
      .in('registration_type', ['waiting_solo', 'waiting_duo'])
    return (data || []).filter(r => !['cancelled', 'rejected'].includes(r.status)).length
  },
  create: async (data) => {
    const { data: existing } = await supabase.from('registrations').select('id').eq('match_id', data.match_id).eq('reacter_id', data.reacter_id).maybeSingle()
    if (existing) throw new Error('Ya estás inscrito en este partido')
    const { data: inserted, error } = await supabase.from('registrations').insert(data).select().single()
    if (error) throw new Error(error.message)
    return inserted
  },
  update: async (id, data) => {
    await supabase.from('registrations').update(data).eq('id', id)
  },
  delete: async (id) => {
    await supabase.from('registrations').delete().eq('id', id)
  },
}

export async function seedMatchesIfEmpty() {
  if (DEMO_MODE) return
  const { count } = await supabase.from('matches').select('*', { count: 'exact', head: true })
  if (count === 0) {
    const { worldCupMatches } = await import('../data/worldcupMatches.js')
    const chunks = []
    for (let i = 0; i < worldCupMatches.length; i += 20) {
      chunks.push(worldCupMatches.slice(i, i + 20))
    }
    for (const chunk of chunks) {
      await supabase.from('matches').insert(chunk.map(m => {
        // eslint-disable-next-line no-unused-vars
        const { id, ...rest } = m
        return rest
      }))
    }
  }
}

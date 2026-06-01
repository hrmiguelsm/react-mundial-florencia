import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Calendar, Clock, AlertTriangle, Mic2, X, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { matches, registrations, reacters, authorizedUsers } from '../lib/db.js'

const MAX_WAITING = 6
const MAX_MAIN = 2

function formatDate(dateStr) {
  if (!dateStr) return 'TBD'
  const [y, m, d] = dateStr.split('-')
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${d} ${months[parseInt(m) - 1]} ${y}`
}

function TransmissionBadge({ type, custom }) {
  if (type === 'studio') return <span className="px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded-full text-xs font-medium">🎥 Estudio Florencia</span>
  if (type === 'home') return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">🏠 Desde la casa</span>
  return <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">✍️ {custom || 'Personalizado'}</span>
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pendiente ⏳', cls: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { label: '✓ Confirmado', cls: 'bg-green-500/20 text-green-400' },
    waiting: { label: 'En espera', cls: 'bg-blue-500/20 text-blue-400' },
    rejected: { label: 'No seleccionado', cls: 'bg-red-500/20 text-red-400' },
    cancelled: { label: 'Cancelado', cls: 'bg-gray-500/20 text-gray-400' },
  }
  const s = map[status] || { label: status, cls: 'bg-white/10 text-white/60' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>
}

function MatchCard({ match, myReg, allRegs, onAction, myReacterId, myDuoRut }) {
  const [expanded, setExpanded] = useState(false)

  // Separate main and waiting registrations (only active ones)
  const mainRegs = allRegs.filter(r =>
    ['solo', 'duo'].includes(r.registration_type) &&
    !['cancelled', 'rejected'].includes(r.status)
  )
  const waitingRegs = allRegs.filter(r =>
    ['waiting_solo', 'waiting_duo'].includes(r.registration_type) &&
    !['cancelled', 'rejected'].includes(r.status)
  )

  const mainCount = mainRegs.length
  const waitingCount = waitingRegs.length
  const isClosed = match.status === 'closed' || match.status === 'confirmed' || match.status === 'finished'
  const waitingFull = waitingCount >= MAX_WAITING

  // What buttons to show
  const showMain = !myReg && !isClosed && mainCount < MAX_MAIN
  const showWaiting = !myReg && !isClosed && mainCount >= MAX_MAIN && !waitingFull

  const hasDuo = myReg === undefined ? false : false // will be determined from session outside

  return (
    <div className={`bg-navy-800 border rounded-2xl overflow-hidden transition-colors ${isClosed ? 'border-white/5 opacity-75' : 'border-white/5 hover:border-gold-500/20'}`}>
      <div className="p-5">
        {/* Teams */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl">{match.flag_a}</span>
            <div className="text-center flex-1">
              <p className="text-white font-bold text-sm">{match.team_a}</p>
              <p className="text-gold-500 font-black text-lg">VS</p>
              <p className="text-white font-bold text-sm">{match.team_b}</p>
            </div>
            <span className="text-3xl">{match.flag_b}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(match.match_date)}</span>
            <Clock className="w-3.5 h-3.5 ml-2" />
            <span>{match.match_time || 'TBD'}</span>
          </div>
          <p className="text-white/40 text-xs">{match.phase}</p>
          <TransmissionBadge type={match.transmission_type} custom={match.custom_transmission_text} />
        </div>

        {/* Registration counts */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Mic2 className="w-3.5 h-3.5 text-green-400" />
            <span>{mainCount} inscritos</span>
          </div>
          {waitingCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>{waitingCount} en espera</span>
            </div>
          )}
        </div>

        {/* Closed banner */}
        {isClosed && (
          <div className="mb-3 bg-red-900/20 border border-red-500/20 rounded-xl px-3 py-2 text-red-400 text-xs font-medium text-center">
            🔒 Inscripciones cerradas — producción seleccionando participantes
          </div>
        )}

        {/* Waiting full banner */}
        {!isClosed && !myReg && mainCount >= MAX_MAIN && waitingFull && (
          <div className="mb-3 bg-orange-900/20 border border-orange-500/20 rounded-xl px-3 py-2 text-orange-400 text-xs font-medium text-center">
            ⚠️ Lista de espera completa ({MAX_WAITING}/{MAX_WAITING})
          </div>
        )}

        {/* My current status — solo muestra estado, sin botón cancelar */}
        {myReg && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-navy-900 rounded-xl">
            <span className="text-xs text-white/50">Tu inscripción:</span>
            <StatusBadge status={myReg.status} />
          </div>
        )}

        {/* Main inscription buttons (< 2 inscritos) */}
        {showMain && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => onAction('solo', match)}
              className="py-2 px-3 gold-gradient text-navy-950 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
            >
              <Mic2 className="w-3.5 h-3.5" /> Inscribirme solo
            </button>
            <button
              onClick={() => onAction('duo', match)}
              className="py-2 px-3 bg-gold-600/20 border border-gold-600/30 text-gold-400 text-xs font-bold rounded-xl hover:bg-gold-600/30 transition-colors flex items-center justify-center gap-1"
            >
              <Users className="w-3.5 h-3.5" /> Con mi dupla
            </button>
          </div>
        )}

        {/* Waiting buttons (>= 2 inscritos, waiting not full) */}
        {showWaiting && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => onAction('waiting_solo', match)}
              className="py-2 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-xl hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" /> Espera solo
            </button>
            <button
              onClick={() => onAction('waiting_duo', match)}
              className="py-2 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-xl hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" /> Espera dupla
            </button>
          </div>
        )}

        {/* Expand registrants */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs text-white/30 hover:text-white/60 mt-3 text-center transition-colors"
        >
          {expanded ? 'Ocultar inscritos ▲' : 'Ver inscritos ▼'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-white/5 px-5 py-4">
          {allRegs.length === 0 ? (
            <p className="text-white/30 text-xs text-center">Sin inscripciones aún</p>
          ) : (
            <div className="space-y-2">
              {mainRegs.length > 0 && (
                <div>
                  <p className="text-xs text-gold-400 font-medium mb-1">🎙️ Postulantes principales</p>
                  {mainRegs.map((r, i) => {
                    const isMe = r.reacter_id === myReacterId
                    const canRemove = !isClosed && !['confirmed'].includes(r.status) && isMe
                    return (
                      <div key={r.id} className="flex items-center justify-between text-xs py-1.5">
                        <span className={`${isMe ? 'text-gold-400 font-medium' : 'text-white/60'}`}>
                          {i + 1}. {r.reacter_name || r.reacter_id} {isMe && '(tú)'}
                        </span>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={r.status} />
                          {canRemove && (
                            <button onClick={() => onAction('cancel', match, r)} className="text-red-400/60 hover:text-red-400 transition-colors ml-1" title="Eliminar inscripción">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {waitingRegs.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-blue-400 font-medium mb-1">⏳ Lista de espera ({waitingRegs.length}/{MAX_WAITING})</p>
                  {waitingRegs.map((r, i) => {
                    const isMe = r.reacter_id === myReacterId
                    const canRemove = !isClosed && !['confirmed'].includes(r.status) && isMe
                    return (
                      <div key={r.id} className="flex items-center justify-between text-xs py-1.5">
                        <span className={`${isMe ? 'text-gold-400 font-medium' : 'text-white/60'}`}>
                          {i + 1}. {r.reacter_name || r.reacter_id} {isMe && '(tú)'}
                        </span>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={r.status} />
                          {canRemove && (
                            <button onClick={() => onAction('cancel', match, r)} className="text-red-400/60 hover:text-red-400 transition-colors ml-1" title="Eliminar inscripción">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Cancel Duo Modal ──────────────────────────────────────────
function CancelDuoModal({ duoName, onCancelSolo, onCancelBoth, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4">
        <h3 className="text-white font-bold text-lg text-center">¿Cómo quieres cancelar?</h3>
        <p className="text-white/50 text-sm text-center">
          Estás inscrito junto a <span className="text-gold-400 font-medium">{duoName}</span>
        </p>
        <div className="space-y-3 pt-2">
          <button
            onClick={onCancelSolo}
            className="w-full py-3 bg-orange-500/15 border border-orange-500/30 text-orange-300 font-semibold rounded-xl hover:bg-orange-500/25 transition-colors text-sm"
          >
            Solo yo salgo del partido
          </button>
          <button
            onClick={onCancelBoth}
            className="w-full py-3 bg-red-500/15 border border-red-500/30 text-red-300 font-semibold rounded-xl hover:bg-red-500/25 transition-colors text-sm"
          >
            Salimos los dos del partido
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            No cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReacterDashboard() {
  const navigate = useNavigate()
  const { reacterSession, logoutReacter } = useAuth()
  const [visibleMatches, setVisibleMatches] = useState([])
  const [allRegs, setAllRegs] = useState({})
  const [myRegs, setMyRegs] = useState({})
  const [filter, setFilter] = useState('all')
  const [cancelModal, setCancelModal] = useState(null) // { match, myReg }

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    // Show active + closed matches to reacters
    const ms = await matches.getVisible()
    setVisibleMatches(ms)
    const regsMap = {}
    const myMap = {}
    for (const m of ms) {
      const regs = await registrations.getByMatch(m.id)
      regsMap[m.id] = regs
      if (reacterSession?.reacter) {
        myMap[m.id] = regs.find(r => r.reacter_id === reacterSession.reacter.id) || null
      }
    }
    setAllRegs(regsMap)
    setMyRegs(myMap)
  }

  const handleAction = async (action, match, myReg) => {
    if (!reacterSession?.reacter) {
      alert('Completa tu perfil primero')
      navigate('/reacter/perfil')
      return
    }

    try {
      if (action === 'cancel') {
        if (!window.confirm('¿Eliminar esta inscripción?')) return
        await registrations.delete(myReg.id)
      } else {
        const reacter = reacterSession.reacter

        // Validate duo registration
        if ((action === 'duo' || action === 'waiting_duo') && !reacter.has_duo) {
          alert('No tienes una dupla configurada en tu perfil.\n\nVe a Mi Perfil y agrega tu dupla primero.')
          navigate('/reacter/perfil')
          return
        }

        const statusMap = {
          solo: 'pending',
          duo: 'pending',
          waiting_solo: 'waiting',
          waiting_duo: 'waiting',
        }

        const isDuo = action === 'duo' || action === 'waiting_duo'

        // Register current user
        await registrations.create({
          match_id: match.id,
          reacter_id: reacter.id,
          reacter_name: reacter.name,
          registration_type: action,
          status: statusMap[action],
          observations: isDuo && reacter.duo_name ? `Dupla con: ${reacter.duo_name}` : '',
        })

        // If registering with duo, also register the duo partner as a separate entry
        if (isDuo && reacter.duo_name && reacter.duo_rut) {
          try {
            // Look for duo partner's profile
            let duoProfile = await reacters.getByRut(reacter.duo_rut)

            // If duo partner has no profile yet, create one automatically
            if (!duoProfile) {
              // Make sure they exist in authorized_users first
              const duoAuthUser = await authorizedUsers.getByRut(reacter.duo_rut)
              if (!duoAuthUser) {
                await authorizedUsers.add(reacter.duo_rut, reacter.duo_name)
              }
              // Create reacter profile for duo partner
              duoProfile = await reacters.upsert({
                rut: reacter.duo_rut,
                name: reacter.duo_name,
                email: reacter.duo_email || '',
                phone: reacter.duo_phone || '',
                has_duo: true,
                duo_name: reacter.name,
                duo_rut: reacter.rut,
                duo_email: reacter.email || '',
                duo_phone: reacter.phone || '',
              })
            }

            // Now create the registration for the duo partner
            await registrations.create({
              match_id: match.id,
              reacter_id: duoProfile.id,
              reacter_name: duoProfile.name,
              registration_type: action,
              status: statusMap[action],
              observations: `Dupla con: ${reacter.name}`,
            })
          } catch (e) {
            if (!e.message?.includes('Ya estás inscrito')) {
              console.warn('Dupla:', e.message)
            }
          }
        }
      }
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const phases = ['all', ...new Set(visibleMatches.map(m => m.phase))]
  const filtered = filter === 'all' ? visibleMatches : visibleMatches.filter(m => m.phase === filter)

  // Cancel solo — only remove own registration
  const handleCancelSolo = async () => {
    const { myReg } = cancelModal
    setCancelModal(null)
    await registrations.delete(myReg.id)
    loadData()
  }

  // Cancel both — remove own + duo partner's registration
  const handleCancelBoth = async () => {
    const { match, myReg } = cancelModal
    setCancelModal(null)
    await registrations.delete(myReg.id)
    const reacter = reacterSession.reacter
    if (reacter.duo_rut) {
      const duoProfile = await reacters.getByRut(reacter.duo_rut)
      if (duoProfile) {
        const allMatchRegs = await registrations.getByMatch(match.id)
        const duoReg = allMatchRegs.find(r => r.reacter_id === duoProfile.id)
        if (duoReg) await registrations.delete(duoReg.id)
      }
    }
    loadData()
  }

  const handleLogout = () => { logoutReacter(); navigate('/') }

  return (
    <>
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <div className="bg-navy-900 border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚽</span>
            <div>
              <p className="text-white font-bold text-sm">React Mundial Florencia</p>
              <p className="text-white/40 text-xs">{reacterSession?.reacter?.name || reacterSession?.rut}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/reacter/perfil')} className="p-2 text-white/50 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-2 text-white/50 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Notices */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-500/20 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-sm">
              <strong>Importante:</strong> Debes llegar o conectarte <strong>15 minutos antes</strong> del inicio del programa.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-gold-900/10 border border-gold-500/10 rounded-xl px-4 py-3">
            <Mic2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p className="text-white/60 text-sm">
              La producción de <strong className="text-gold-400">Florencia Digital</strong> definirá finalmente quiénes transmitirán cada partido.
            </p>
          </div>
        </div>

        {/* Phase filter */}
        {phases.length > 2 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {phases.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${filter === p ? 'gold-gradient text-navy-950 font-bold' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
              >
                {p === 'all' ? 'Todos' : p.replace('Fase de Grupos - ', '')}
              </button>
            ))}
          </div>
        )}

        {/* Matches grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-white/40 text-lg">No hay partidos disponibles aún</p>
            <p className="text-white/20 text-sm mt-2">El admin habilitará los partidos pronto</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                myReg={myRegs[m.id]}
                allRegs={allRegs[m.id] || []}
                onAction={handleAction}
                myReacterId={reacterSession?.reacter?.id}
                myDuoRut={reacterSession?.reacter?.duo_rut}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    {cancelModal && (
      <CancelDuoModal
        duoName={reacterSession.reacter?.duo_name}
        onCancelSolo={handleCancelSolo}
        onCancelBoth={handleCancelBoth}
        onClose={() => setCancelModal(null)}
      />
    )}
    </>
  )
}

import React from 'react'
import { Settings as SettingsIcon, Database, Shield, Info } from 'lucide-react'
import { DEMO_MODE } from '../../lib/supabase.js'

function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-navy-800 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gold-400" />
        </div>
        <h2 className="text-base font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const clearDemo = () => {
    if (!window.confirm('¿Borrar TODOS los datos del modo demo? Esto no se puede deshacer.')) return
    const keys = Object.keys(localStorage).filter(k => k.startsWith('rmf_'))
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Configuración</h1>
        <p className="text-white/40 text-sm">Ajustes del sistema React Mundial Florencia</p>
      </div>

      <div className="space-y-4">
        <Card icon={Database} title="Modo de datos">
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${DEMO_MODE ? 'bg-yellow-900/10 border-yellow-500/20' : 'bg-green-900/10 border-green-500/20'}`}>
            <Info className={`w-5 h-5 shrink-0 mt-0.5 ${DEMO_MODE ? 'text-yellow-400' : 'text-green-400'}`} />
            <div>
              <p className={`font-semibold text-sm ${DEMO_MODE ? 'text-yellow-300' : 'text-green-300'}`}>
                {DEMO_MODE ? 'Modo Demo activo' : 'Supabase conectado'}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {DEMO_MODE
                  ? 'Los datos se guardan en localStorage. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para conectar a Supabase.'
                  : 'Conectado a la base de datos Supabase. Los datos son persistentes.'
                }
              </p>
            </div>
          </div>
          {DEMO_MODE && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-white/40">Variables de entorno requeridas:</p>
              <div className="bg-navy-950 rounded-xl p-3 font-mono text-xs text-green-300 space-y-1">
                <p>VITE_SUPABASE_URL=https://xxx.supabase.co</p>
                <p>VITE_SUPABASE_ANON_KEY=eyJ...</p>
              </div>
              <button onClick={clearDemo} className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/20 text-red-400 rounded-xl text-sm transition-colors">
                Limpiar datos demo
              </button>
            </div>
          )}
        </Card>

        <Card icon={Shield} title="Credenciales de administrador">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-navy-900 rounded-xl">
              <span className="text-white/50 text-sm">Usuario</span>
              <span className="text-white font-mono text-sm">florenciadigital</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-navy-900 rounded-xl">
              <span className="text-white/50 text-sm">Contraseña</span>
              <span className="text-white font-mono text-sm">odin</span>
            </div>
            <p className="text-xs text-white/30">Las credenciales están hardcodeadas en el código fuente. Para cambiarlas edita AdminLogin.jsx.</p>
          </div>
        </Card>

        <Card icon={SettingsIcon} title="Información del sistema">
          <div className="space-y-2">
            {[
              ['Versión', '1.0.0'],
              ['Plataforma', 'React Mundial Florencia'],
              ['Cliente', 'Florencia Digital'],
              ['Mundial', 'FIFA World Cup 2026'],
              ['Stack', 'React 18 + Vite + Tailwind CSS'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-white/40 text-sm">{k}</span>
                <span className="text-white/80 text-sm">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

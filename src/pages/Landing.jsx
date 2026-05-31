import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic2, Star } from 'lucide-react'

function Stars() {
  const [stars] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
    }))
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-navy-950 relative flex flex-col items-center justify-between px-4 py-8 overflow-hidden">
      <Stars />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />

      {/* Floating decorations */}
      <div className="absolute top-10 right-10 text-5xl animate-float opacity-30 select-none">⚽</div>
      <div className="absolute bottom-20 left-10 text-4xl animate-float-delay opacity-20 select-none">⚽</div>
      <div className="absolute top-1/4 left-8 text-3xl animate-float opacity-20 select-none" style={{ animationDelay: '1s' }}>🏆</div>

      {/* Spacer top */}
      <div />

      {/* Main hero */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🏆</span>
            <span className="text-5xl">⚽</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black gold-shimmer mb-3 tracking-tight">
            REACT MUNDIAL
          </h1>
          <h2 className="text-3xl md:text-5xl font-black gold-shimmer mb-4 tracking-tight">
            FLORENCIA
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-16 bg-gold-500 opacity-50" />
            <p className="text-gold-400 font-semibold tracking-[0.3em] text-sm md:text-base uppercase">
              FIFA World Cup 2026
            </p>
            <div className="h-px w-16 bg-gold-500 opacity-50" />
          </div>
          <p className="text-white/50 text-sm">Plataforma de gestión de transmisiones</p>
        </div>

        {/* Big REACTERS button */}
        <button
          onClick={() => navigate('/reacter/login')}
          className="w-full group cursor-pointer bg-navy-800 border-2 border-gold-500/60 rounded-2xl p-10 text-center card-hover glow-gold focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center">
              <Mic2 className="w-7 h-7 text-navy-950" />
            </div>
            <span className="text-4xl">🎙️</span>
          </div>
          <h3 className="text-4xl font-black text-white mb-3 group-hover:text-gold-400 transition-colors tracking-tight">
            REACTERS
          </h3>
          <p className="text-white/60 text-base leading-relaxed mb-6">
            Regístrate e inscríbete en los partidos del Mundial.<br />
            Reacciona en vivo con Florencia Digital.
          </p>
          <div className="flex items-center justify-center gap-2 text-gold-500 font-bold text-lg">
            <span>Ingresar</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Stars row */}
        <div className="flex gap-2 mt-8 opacity-60">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
          ))}
        </div>
      </div>

      {/* Footer with tiny admin link */}
      <footer className="relative z-10 text-center mt-8">
        <p className="text-white/30 text-xs mb-3">Florencia Digital © 2026 · React Mundial</p>
        <button
          onClick={() => navigate('/admin')}
          className="text-white/20 hover:text-white/50 text-xs transition-colors"
        >
          ⚙️ Admin Florencia
        </button>
      </footer>
    </div>
  )
}

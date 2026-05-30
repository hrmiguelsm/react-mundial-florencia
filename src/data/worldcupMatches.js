// FIFA World Cup 2026 - All 104 matches
// Groups: A-L, 48 teams, 72 group stage + 32 knockout matches
// Times in Chile time (UTC-4)

export const worldCupMatches = [
  // ── GROUP A: México, Jamaica, Ecuador, Venezuela ──
  { id: 'WC001', team_a: 'México', team_b: 'Jamaica', flag_a: '🇲🇽', flag_b: '🇯🇲', match_date: '2026-06-11', match_time: '17:00', phase: 'Fase de Grupos - Grupo A', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC002', team_a: 'Ecuador', team_b: 'Venezuela', flag_a: '🇪🇨', flag_b: '🇻🇪', match_date: '2026-06-11', match_time: '20:00', phase: 'Fase de Grupos - Grupo A', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC003', team_a: 'México', team_b: 'Ecuador', flag_a: '🇲🇽', flag_b: '🇪🇨', match_date: '2026-06-15', match_time: '17:00', phase: 'Fase de Grupos - Grupo A', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC004', team_a: 'Jamaica', team_b: 'Venezuela', flag_a: '🇯🇲', flag_b: '🇻🇪', match_date: '2026-06-15', match_time: '14:00', phase: 'Fase de Grupos - Grupo A', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC005', team_a: 'México', team_b: 'Venezuela', flag_a: '🇲🇽', flag_b: '🇻🇪', match_date: '2026-06-19', match_time: '20:00', phase: 'Fase de Grupos - Grupo A', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC006', team_a: 'Jamaica', team_b: 'Ecuador', flag_a: '🇯🇲', flag_b: '🇪🇨', match_date: '2026-06-19', match_time: '20:00', phase: 'Fase de Grupos - Grupo A', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP B: USA, Panama, Bolivia, New Zealand ──
  { id: 'WC007', team_a: 'USA', team_b: 'Panama', flag_a: '🇺🇸', flag_b: '🇵🇦', match_date: '2026-06-12', match_time: '11:00', phase: 'Fase de Grupos - Grupo B', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC008', team_a: 'Bolivia', team_b: 'Nueva Zelanda', flag_a: '🇧🇴', flag_b: '🇳🇿', match_date: '2026-06-12', match_time: '14:00', phase: 'Fase de Grupos - Grupo B', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC009', team_a: 'USA', team_b: 'Bolivia', flag_a: '🇺🇸', flag_b: '🇧🇴', match_date: '2026-06-16', match_time: '14:00', phase: 'Fase de Grupos - Grupo B', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC010', team_a: 'Panama', team_b: 'Nueva Zelanda', flag_a: '🇵🇦', flag_b: '🇳🇿', match_date: '2026-06-16', match_time: '11:00', phase: 'Fase de Grupos - Grupo B', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC011', team_a: 'USA', team_b: 'Nueva Zelanda', flag_a: '🇺🇸', flag_b: '🇳🇿', match_date: '2026-06-20', match_time: '20:00', phase: 'Fase de Grupos - Grupo B', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC012', team_a: 'Panama', team_b: 'Bolivia', flag_a: '🇵🇦', flag_b: '🇧🇴', match_date: '2026-06-20', match_time: '20:00', phase: 'Fase de Grupos - Grupo B', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP C: Argentina, Chile, Perú, Australia ──
  { id: 'WC013', team_a: 'Argentina', team_b: 'Chile', flag_a: '🇦🇷', flag_b: '🇨🇱', match_date: '2026-06-12', match_time: '20:00', phase: 'Fase de Grupos - Grupo C', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC014', team_a: 'Perú', team_b: 'Australia', flag_a: '🇵🇪', flag_b: '🇦🇺', match_date: '2026-06-12', match_time: '17:00', phase: 'Fase de Grupos - Grupo C', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC015', team_a: 'Argentina', team_b: 'Perú', flag_a: '🇦🇷', flag_b: '🇵🇪', match_date: '2026-06-16', match_time: '20:00', phase: 'Fase de Grupos - Grupo C', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC016', team_a: 'Chile', team_b: 'Australia', flag_a: '🇨🇱', flag_b: '🇦🇺', match_date: '2026-06-16', match_time: '17:00', phase: 'Fase de Grupos - Grupo C', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC017', team_a: 'Argentina', team_b: 'Australia', flag_a: '🇦🇷', flag_b: '🇦🇺', match_date: '2026-06-20', match_time: '16:00', phase: 'Fase de Grupos - Grupo C', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC018', team_a: 'Chile', team_b: 'Perú', flag_a: '🇨🇱', flag_b: '🇵🇪', match_date: '2026-06-20', match_time: '16:00', phase: 'Fase de Grupos - Grupo C', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP D: Brasil, Colombia, Paraguay, Costa Rica ──
  { id: 'WC019', team_a: 'Brasil', team_b: 'Colombia', flag_a: '🇧🇷', flag_b: '🇨🇴', match_date: '2026-06-13', match_time: '20:00', phase: 'Fase de Grupos - Grupo D', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC020', team_a: 'Paraguay', team_b: 'Costa Rica', flag_a: '🇵🇾', flag_b: '🇨🇷', match_date: '2026-06-13', match_time: '17:00', phase: 'Fase de Grupos - Grupo D', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC021', team_a: 'Brasil', team_b: 'Paraguay', flag_a: '🇧🇷', flag_b: '🇵🇾', match_date: '2026-06-17', match_time: '20:00', phase: 'Fase de Grupos - Grupo D', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC022', team_a: 'Colombia', team_b: 'Costa Rica', flag_a: '🇨🇴', flag_b: '🇨🇷', match_date: '2026-06-17', match_time: '17:00', phase: 'Fase de Grupos - Grupo D', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC023', team_a: 'Brasil', team_b: 'Costa Rica', flag_a: '🇧🇷', flag_b: '🇨🇷', match_date: '2026-06-21', match_time: '20:00', phase: 'Fase de Grupos - Grupo D', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC024', team_a: 'Colombia', team_b: 'Paraguay', flag_a: '🇨🇴', flag_b: '🇵🇾', match_date: '2026-06-21', match_time: '20:00', phase: 'Fase de Grupos - Grupo D', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP E: Francia, Inglaterra, Alemania, Polonia ──
  { id: 'WC025', team_a: 'Francia', team_b: 'Inglaterra', flag_a: '🇫🇷', flag_b: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', match_date: '2026-06-13', match_time: '11:00', phase: 'Fase de Grupos - Grupo E', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC026', team_a: 'Alemania', team_b: 'Polonia', flag_a: '🇩🇪', flag_b: '🇵🇱', match_date: '2026-06-13', match_time: '14:00', phase: 'Fase de Grupos - Grupo E', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC027', team_a: 'Francia', team_b: 'Alemania', flag_a: '🇫🇷', flag_b: '🇩🇪', match_date: '2026-06-17', match_time: '14:00', phase: 'Fase de Grupos - Grupo E', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC028', team_a: 'Inglaterra', team_b: 'Polonia', flag_a: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag_b: '🇵🇱', match_date: '2026-06-17', match_time: '11:00', phase: 'Fase de Grupos - Grupo E', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC029', team_a: 'Francia', team_b: 'Polonia', flag_a: '🇫🇷', flag_b: '🇵🇱', match_date: '2026-06-21', match_time: '16:00', phase: 'Fase de Grupos - Grupo E', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC030', team_a: 'Alemania', team_b: 'Inglaterra', flag_a: '🇩🇪', flag_b: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', match_date: '2026-06-21', match_time: '16:00', phase: 'Fase de Grupos - Grupo E', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP F: España, Portugal, Bélgica, Italia ──
  { id: 'WC031', team_a: 'España', team_b: 'Portugal', flag_a: '🇪🇸', flag_b: '🇵🇹', match_date: '2026-06-14', match_time: '20:00', phase: 'Fase de Grupos - Grupo F', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC032', team_a: 'Bélgica', team_b: 'Italia', flag_a: '🇧🇪', flag_b: '🇮🇹', match_date: '2026-06-14', match_time: '17:00', phase: 'Fase de Grupos - Grupo F', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC033', team_a: 'España', team_b: 'Bélgica', flag_a: '🇪🇸', flag_b: '🇧🇪', match_date: '2026-06-18', match_time: '20:00', phase: 'Fase de Grupos - Grupo F', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC034', team_a: 'Portugal', team_b: 'Italia', flag_a: '🇵🇹', flag_b: '🇮🇹', match_date: '2026-06-18', match_time: '17:00', phase: 'Fase de Grupos - Grupo F', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC035', team_a: 'España', team_b: 'Italia', flag_a: '🇪🇸', flag_b: '🇮🇹', match_date: '2026-06-22', match_time: '20:00', phase: 'Fase de Grupos - Grupo F', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC036', team_a: 'Portugal', team_b: 'Bélgica', flag_a: '🇵🇹', flag_b: '🇧🇪', match_date: '2026-06-22', match_time: '20:00', phase: 'Fase de Grupos - Grupo F', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP G: Países Bajos, Turquía, Croacia, Serbia ──
  { id: 'WC037', team_a: 'Países Bajos', team_b: 'Turquía', flag_a: '🇳🇱', flag_b: '🇹🇷', match_date: '2026-06-14', match_time: '11:00', phase: 'Fase de Grupos - Grupo G', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC038', team_a: 'Croacia', team_b: 'Serbia', flag_a: '🇭🇷', flag_b: '🇷🇸', match_date: '2026-06-14', match_time: '14:00', phase: 'Fase de Grupos - Grupo G', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC039', team_a: 'Países Bajos', team_b: 'Croacia', flag_a: '🇳🇱', flag_b: '🇭🇷', match_date: '2026-06-18', match_time: '14:00', phase: 'Fase de Grupos - Grupo G', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC040', team_a: 'Turquía', team_b: 'Serbia', flag_a: '🇹🇷', flag_b: '🇷🇸', match_date: '2026-06-18', match_time: '11:00', phase: 'Fase de Grupos - Grupo G', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC041', team_a: 'Países Bajos', team_b: 'Serbia', flag_a: '🇳🇱', flag_b: '🇷🇸', match_date: '2026-06-22', match_time: '16:00', phase: 'Fase de Grupos - Grupo G', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC042', team_a: 'Turquía', team_b: 'Croacia', flag_a: '🇹🇷', flag_b: '🇭🇷', match_date: '2026-06-22', match_time: '16:00', phase: 'Fase de Grupos - Grupo G', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP H: Marruecos, Senegal, Camerún, Sudáfrica ──
  { id: 'WC043', team_a: 'Marruecos', team_b: 'Senegal', flag_a: '🇲🇦', flag_b: '🇸🇳', match_date: '2026-06-15', match_time: '11:00', phase: 'Fase de Grupos - Grupo H', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC044', team_a: 'Camerún', team_b: 'Sudáfrica', flag_a: '🇨🇲', flag_b: '🇿🇦', match_date: '2026-06-15', match_time: '14:00', phase: 'Fase de Grupos - Grupo H', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC045', team_a: 'Marruecos', team_b: 'Camerún', flag_a: '🇲🇦', flag_b: '🇨🇲', match_date: '2026-06-19', match_time: '14:00', phase: 'Fase de Grupos - Grupo H', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC046', team_a: 'Senegal', team_b: 'Sudáfrica', flag_a: '🇸🇳', flag_b: '🇿🇦', match_date: '2026-06-19', match_time: '11:00', phase: 'Fase de Grupos - Grupo H', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC047', team_a: 'Marruecos', team_b: 'Sudáfrica', flag_a: '🇲🇦', flag_b: '🇿🇦', match_date: '2026-06-23', match_time: '20:00', phase: 'Fase de Grupos - Grupo H', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC048', team_a: 'Senegal', team_b: 'Camerún', flag_a: '🇸🇳', flag_b: '🇨🇲', match_date: '2026-06-23', match_time: '20:00', phase: 'Fase de Grupos - Grupo H', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP I: Japón, Corea del Sur, Irán, Arabia Saudita ──
  { id: 'WC049', team_a: 'Japón', team_b: 'Corea del Sur', flag_a: '🇯🇵', flag_b: '🇰🇷', match_date: '2026-06-15', match_time: '20:00', phase: 'Fase de Grupos - Grupo I', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC050', team_a: 'Irán', team_b: 'Arabia Saudita', flag_a: '🇮🇷', flag_b: '🇸🇦', match_date: '2026-06-15', match_time: '17:00', phase: 'Fase de Grupos - Grupo I', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC051', team_a: 'Japón', team_b: 'Irán', flag_a: '🇯🇵', flag_b: '🇮🇷', match_date: '2026-06-19', match_time: '17:00', phase: 'Fase de Grupos - Grupo I', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC052', team_a: 'Corea del Sur', team_b: 'Arabia Saudita', flag_a: '🇰🇷', flag_b: '🇸🇦', match_date: '2026-06-19', match_time: '20:00', phase: 'Fase de Grupos - Grupo I', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC053', team_a: 'Japón', team_b: 'Arabia Saudita', flag_a: '🇯🇵', flag_b: '🇸🇦', match_date: '2026-06-23', match_time: '16:00', phase: 'Fase de Grupos - Grupo I', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC054', team_a: 'Corea del Sur', team_b: 'Irán', flag_a: '🇰🇷', flag_b: '🇮🇷', match_date: '2026-06-23', match_time: '16:00', phase: 'Fase de Grupos - Grupo I', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP J: Uruguay, Canadá, Honduras, Guatemala ──
  { id: 'WC055', team_a: 'Uruguay', team_b: 'Canadá', flag_a: '🇺🇾', flag_b: '🇨🇦', match_date: '2026-06-16', match_time: '17:00', phase: 'Fase de Grupos - Grupo J', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC056', team_a: 'Honduras', team_b: 'Guatemala', flag_a: '🇭🇳', flag_b: '🇬🇹', match_date: '2026-06-16', match_time: '20:00', phase: 'Fase de Grupos - Grupo J', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC057', team_a: 'Uruguay', team_b: 'Honduras', flag_a: '🇺🇾', flag_b: '🇭🇳', match_date: '2026-06-20', match_time: '14:00', phase: 'Fase de Grupos - Grupo J', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC058', team_a: 'Canadá', team_b: 'Guatemala', flag_a: '🇨🇦', flag_b: '🇬🇹', match_date: '2026-06-20', match_time: '11:00', phase: 'Fase de Grupos - Grupo J', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC059', team_a: 'Uruguay', team_b: 'Guatemala', flag_a: '🇺🇾', flag_b: '🇬🇹', match_date: '2026-06-24', match_time: '16:00', phase: 'Fase de Grupos - Grupo J', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC060', team_a: 'Canadá', team_b: 'Honduras', flag_a: '🇨🇦', flag_b: '🇭🇳', match_date: '2026-06-24', match_time: '16:00', phase: 'Fase de Grupos - Grupo J', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP K: Suiza, Suecia, Austria, Rumanía ──
  { id: 'WC061', team_a: 'Suiza', team_b: 'Suecia', flag_a: '🇨🇭', flag_b: '🇸🇪', match_date: '2026-06-17', match_time: '11:00', phase: 'Fase de Grupos - Grupo K', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC062', team_a: 'Austria', team_b: 'Rumanía', flag_a: '🇦🇹', flag_b: '🇷🇴', match_date: '2026-06-17', match_time: '14:00', phase: 'Fase de Grupos - Grupo K', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC063', team_a: 'Suiza', team_b: 'Austria', flag_a: '🇨🇭', flag_b: '🇦🇹', match_date: '2026-06-21', match_time: '11:00', phase: 'Fase de Grupos - Grupo K', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC064', team_a: 'Suecia', team_b: 'Rumanía', flag_a: '🇸🇪', flag_b: '🇷🇴', match_date: '2026-06-21', match_time: '14:00', phase: 'Fase de Grupos - Grupo K', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC065', team_a: 'Suiza', team_b: 'Rumanía', flag_a: '🇨🇭', flag_b: '🇷🇴', match_date: '2026-06-25', match_time: '16:00', phase: 'Fase de Grupos - Grupo K', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC066', team_a: 'Suecia', team_b: 'Austria', flag_a: '🇸🇪', flag_b: '🇦🇹', match_date: '2026-06-25', match_time: '16:00', phase: 'Fase de Grupos - Grupo K', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── GROUP L: Qatar, Ucrania, Albania, Eslovenia ──
  { id: 'WC067', team_a: 'Qatar', team_b: 'Ucrania', flag_a: '🇶🇦', flag_b: '🇺🇦', match_date: '2026-06-18', match_time: '20:00', phase: 'Fase de Grupos - Grupo L', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC068', team_a: 'Albania', team_b: 'Eslovenia', flag_a: '🇦🇱', flag_b: '🇸🇮', match_date: '2026-06-18', match_time: '17:00', phase: 'Fase de Grupos - Grupo L', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC069', team_a: 'Qatar', team_b: 'Albania', flag_a: '🇶🇦', flag_b: '🇦🇱', match_date: '2026-06-22', match_time: '14:00', phase: 'Fase de Grupos - Grupo L', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC070', team_a: 'Ucrania', team_b: 'Eslovenia', flag_a: '🇺🇦', flag_b: '🇸🇮', match_date: '2026-06-22', match_time: '11:00', phase: 'Fase de Grupos - Grupo L', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC071', team_a: 'Qatar', team_b: 'Eslovenia', flag_a: '🇶🇦', flag_b: '🇸🇮', match_date: '2026-06-26', match_time: '16:00', phase: 'Fase de Grupos - Grupo L', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC072', team_a: 'Ucrania', team_b: 'Albania', flag_a: '🇺🇦', flag_b: '🇦🇱', match_date: '2026-06-26', match_time: '16:00', phase: 'Fase de Grupos - Grupo L', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── ROUND OF 32 (Octavos de Final) ──
  { id: 'WC073', team_a: '1A', team_b: '2B', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-02', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo A vs Segundo Grupo B' },
  { id: 'WC074', team_a: '1C', team_b: '2D', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-02', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo C vs Segundo Grupo D' },
  { id: 'WC075', team_a: '1E', team_b: '2F', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-03', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo E vs Segundo Grupo F' },
  { id: 'WC076', team_a: '1G', team_b: '2H', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-03', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo G vs Segundo Grupo H' },
  { id: 'WC077', team_a: '1B', team_b: '2A', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-04', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo B vs Segundo Grupo A' },
  { id: 'WC078', team_a: '1D', team_b: '2C', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-04', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo D vs Segundo Grupo C' },
  { id: 'WC079', team_a: '1F', team_b: '2E', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-05', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo F vs Segundo Grupo E' },
  { id: 'WC080', team_a: '1H', team_b: '2G', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-05', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo H vs Segundo Grupo G' },
  { id: 'WC081', team_a: '1I', team_b: '2J', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-06', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo I vs Segundo Grupo J' },
  { id: 'WC082', team_a: '1K', team_b: '2L', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-06', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo K vs Segundo Grupo L' },
  { id: 'WC083', team_a: '1J', team_b: '2I', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-07', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo J vs Segundo Grupo I' },
  { id: 'WC084', team_a: '1L', team_b: '2K', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-07', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Ganador Grupo L vs Segundo Grupo K' },
  { id: 'WC085', team_a: 'Mejor 3° Grupo 1', team_b: 'Mejor 3° Grupo 2', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-08', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Mejor terceros' },
  { id: 'WC086', team_a: 'Mejor 3° Grupo 3', team_b: 'Mejor 3° Grupo 4', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-08', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Mejor terceros' },
  { id: 'WC087', team_a: 'Mejor 3° Grupo 5', team_b: 'Mejor 3° Grupo 6', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-09', match_time: '14:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Mejor terceros' },
  { id: 'WC088', team_a: 'Mejor 3° Grupo 7', team_b: 'Mejor 3° Grupo 8', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-09', match_time: '20:00', phase: 'Octavos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Mejor terceros' },

  // ── CUARTOS DE FINAL ──
  { id: 'WC089', team_a: 'G1 Octavos', team_b: 'G2 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-14', match_time: '14:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC090', team_a: 'G3 Octavos', team_b: 'G4 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-14', match_time: '20:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC091', team_a: 'G5 Octavos', team_b: 'G6 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-15', match_time: '14:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC092', team_a: 'G7 Octavos', team_b: 'G8 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-15', match_time: '20:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC093', team_a: 'G9 Octavos', team_b: 'G10 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-16', match_time: '14:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC094', team_a: 'G11 Octavos', team_b: 'G12 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-16', match_time: '20:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC095', team_a: 'G13 Octavos', team_b: 'G14 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-17', match_time: '14:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC096', team_a: 'G15 Octavos', team_b: 'G16 Octavos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-17', match_time: '20:00', phase: 'Cuartos de Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── SEMIFINALES ──
  { id: 'WC097', team_a: 'G1 Cuartos', team_b: 'G2 Cuartos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-21', match_time: '20:00', phase: 'Semifinal', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC098', team_a: 'G3 Cuartos', team_b: 'G4 Cuartos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-22', match_time: '20:00', phase: 'Semifinal', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC099', team_a: 'G5 Cuartos', team_b: 'G6 Cuartos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-23', match_time: '20:00', phase: 'Semifinal', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC100', team_a: 'G7 Cuartos', team_b: 'G8 Cuartos', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-24', match_time: '20:00', phase: 'Semifinal', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── TERCER LUGAR ──
  { id: 'WC101', team_a: 'Perdedor SF1', team_b: 'Perdedor SF2', flag_a: '🥉', flag_b: '🥉', match_date: '2026-07-28', match_time: '15:00', phase: 'Tercer Lugar', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },
  { id: 'WC102', team_a: 'Perdedor SF3', team_b: 'Perdedor SF4', flag_a: '🥉', flag_b: '🥉', match_date: '2026-07-28', match_time: '20:00', phase: 'Tercer Lugar', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: '' },

  // ── FINALES ──
  { id: 'WC103', team_a: 'Ganador SF1', team_b: 'Ganador SF2', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-29', match_time: '20:00', phase: 'Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Gran Final' },
  { id: 'WC104', team_a: 'Ganador SF3', team_b: 'Ganador SF4', flag_a: '🏆', flag_b: '🏆', match_date: '2026-07-30', match_time: '16:00', phase: 'Final', transmission_type: 'studio', custom_transmission_text: '', status: 'disabled', notes: 'Gran Final Copa del Mundo 2026' },
]

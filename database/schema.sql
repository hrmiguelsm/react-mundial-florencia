-- ============================================================
-- React Mundial Florencia — Supabase Schema
-- FIFA World Cup 2026
-- ============================================================

-- authorized_users: RUTs chilenos que pueden ingresar al sistema
create table authorized_users (
  id uuid default gen_random_uuid() primary key,
  rut text unique not null,
  name text,
  status text default 'enabled' check (status in ('enabled', 'blocked')),
  created_at timestamptz default now()
);

-- reacters: perfil completo del participante
create table reacters (
  id uuid default gen_random_uuid() primary key,
  rut text unique not null references authorized_users(rut),
  name text not null,
  email text not null,
  phone text,
  has_duo boolean default false,
  duo_name text,
  duo_rut text,
  duo_email text,
  duo_phone text,
  created_at timestamptz default now()
);

-- matches: partidos del Mundial 2026
create table matches (
  id uuid default gen_random_uuid() primary key,
  team_a text not null,
  team_b text not null,
  flag_a text default '🏳️',
  flag_b text default '🏳️',
  match_date date,
  match_time time,
  phase text,
  transmission_type text default 'studio' check (transmission_type in ('studio', 'home', 'custom')),
  custom_transmission_text text,
  status text default 'disabled' check (status in ('active', 'disabled')),
  notes text,
  created_at timestamptz default now()
);

-- registrations: inscripciones de reacters a partidos
create table registrations (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references matches(id) on delete cascade,
  reacter_id uuid references reacters(id) on delete cascade,
  reacter_name text,
  registration_type text default 'solo' check (registration_type in ('solo', 'duo', 'waiting_solo', 'waiting_duo')),
  status text default 'pending' check (status in ('pending', 'confirmed', 'waiting', 'rejected', 'cancelled')),
  observations text,
  created_at timestamptz default now(),
  unique(match_id, reacter_id)
);

-- ============================================================
-- RLS Policies (allow all for anon key — app handles auth)
-- ============================================================
alter table authorized_users enable row level security;
alter table reacters enable row level security;
alter table matches enable row level security;
alter table registrations enable row level security;

create policy "Allow all" on authorized_users for all using (true) with check (true);
create policy "Allow all" on reacters for all using (true) with check (true);
create policy "Allow all" on matches for all using (true) with check (true);
create policy "Allow all" on registrations for all using (true) with check (true);

-- ============================================================
-- Sample authorized users (demo)
-- ============================================================
insert into authorized_users (rut, name, status) values
('12.345.678-9', 'Juan Pérez Demo', 'enabled'),
('98.765.432-1', 'María González Demo', 'enabled'),
('11.111.111-1', 'Carlos Soto Demo', 'enabled');

-- ============================================================
-- All 72 Group Stage matches + 32 Knockout matches
-- ============================================================

-- GROUP A: México, Jamaica, Ecuador, Venezuela
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('México', 'Jamaica', '🇲🇽', '🇯🇲', '2026-06-11', '17:00', 'Fase de Grupos - Grupo A', 'disabled'),
('Ecuador', 'Venezuela', '🇪🇨', '🇻🇪', '2026-06-11', '20:00', 'Fase de Grupos - Grupo A', 'disabled'),
('México', 'Ecuador', '🇲🇽', '🇪🇨', '2026-06-15', '17:00', 'Fase de Grupos - Grupo A', 'disabled'),
('Jamaica', 'Venezuela', '🇯🇲', '🇻🇪', '2026-06-15', '14:00', 'Fase de Grupos - Grupo A', 'disabled'),
('México', 'Venezuela', '🇲🇽', '🇻🇪', '2026-06-19', '20:00', 'Fase de Grupos - Grupo A', 'disabled'),
('Jamaica', 'Ecuador', '🇯🇲', '🇪🇨', '2026-06-19', '20:00', 'Fase de Grupos - Grupo A', 'disabled');

-- GROUP B: USA, Panama, Bolivia, New Zealand
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('USA', 'Panama', '🇺🇸', '🇵🇦', '2026-06-12', '11:00', 'Fase de Grupos - Grupo B', 'disabled'),
('Bolivia', 'Nueva Zelanda', '🇧🇴', '🇳🇿', '2026-06-12', '14:00', 'Fase de Grupos - Grupo B', 'disabled'),
('USA', 'Bolivia', '🇺🇸', '🇧🇴', '2026-06-16', '14:00', 'Fase de Grupos - Grupo B', 'disabled'),
('Panama', 'Nueva Zelanda', '🇵🇦', '🇳🇿', '2026-06-16', '11:00', 'Fase de Grupos - Grupo B', 'disabled'),
('USA', 'Nueva Zelanda', '🇺🇸', '🇳🇿', '2026-06-20', '20:00', 'Fase de Grupos - Grupo B', 'disabled'),
('Panama', 'Bolivia', '🇵🇦', '🇧🇴', '2026-06-20', '20:00', 'Fase de Grupos - Grupo B', 'disabled');

-- GROUP C: Argentina, Chile, Perú, Australia
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Argentina', 'Chile', '🇦🇷', '🇨🇱', '2026-06-12', '20:00', 'Fase de Grupos - Grupo C', 'disabled'),
('Perú', 'Australia', '🇵🇪', '🇦🇺', '2026-06-12', '17:00', 'Fase de Grupos - Grupo C', 'disabled'),
('Argentina', 'Perú', '🇦🇷', '🇵🇪', '2026-06-16', '20:00', 'Fase de Grupos - Grupo C', 'disabled'),
('Chile', 'Australia', '🇨🇱', '🇦🇺', '2026-06-16', '17:00', 'Fase de Grupos - Grupo C', 'disabled'),
('Argentina', 'Australia', '🇦🇷', '🇦🇺', '2026-06-20', '16:00', 'Fase de Grupos - Grupo C', 'disabled'),
('Chile', 'Perú', '🇨🇱', '🇵🇪', '2026-06-20', '16:00', 'Fase de Grupos - Grupo C', 'disabled');

-- GROUP D: Brasil, Colombia, Paraguay, Costa Rica
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Brasil', 'Colombia', '🇧🇷', '🇨🇴', '2026-06-13', '20:00', 'Fase de Grupos - Grupo D', 'disabled'),
('Paraguay', 'Costa Rica', '🇵🇾', '🇨🇷', '2026-06-13', '17:00', 'Fase de Grupos - Grupo D', 'disabled'),
('Brasil', 'Paraguay', '🇧🇷', '🇵🇾', '2026-06-17', '20:00', 'Fase de Grupos - Grupo D', 'disabled'),
('Colombia', 'Costa Rica', '🇨🇴', '🇨🇷', '2026-06-17', '17:00', 'Fase de Grupos - Grupo D', 'disabled'),
('Brasil', 'Costa Rica', '🇧🇷', '🇨🇷', '2026-06-21', '20:00', 'Fase de Grupos - Grupo D', 'disabled'),
('Colombia', 'Paraguay', '🇨🇴', '🇵🇾', '2026-06-21', '20:00', 'Fase de Grupos - Grupo D', 'disabled');

-- GROUP E: Francia, Inglaterra, Alemania, Polonia
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Francia', 'Inglaterra', '🇫🇷', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2026-06-13', '11:00', 'Fase de Grupos - Grupo E', 'disabled'),
('Alemania', 'Polonia', '🇩🇪', '🇵🇱', '2026-06-13', '14:00', 'Fase de Grupos - Grupo E', 'disabled'),
('Francia', 'Alemania', '🇫🇷', '🇩🇪', '2026-06-17', '14:00', 'Fase de Grupos - Grupo E', 'disabled'),
('Inglaterra', 'Polonia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇵🇱', '2026-06-17', '11:00', 'Fase de Grupos - Grupo E', 'disabled'),
('Francia', 'Polonia', '🇫🇷', '🇵🇱', '2026-06-21', '16:00', 'Fase de Grupos - Grupo E', 'disabled'),
('Alemania', 'Inglaterra', '🇩🇪', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2026-06-21', '16:00', 'Fase de Grupos - Grupo E', 'disabled');

-- GROUP F: España, Portugal, Bélgica, Italia
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('España', 'Portugal', '🇪🇸', '🇵🇹', '2026-06-14', '20:00', 'Fase de Grupos - Grupo F', 'disabled'),
('Bélgica', 'Italia', '🇧🇪', '🇮🇹', '2026-06-14', '17:00', 'Fase de Grupos - Grupo F', 'disabled'),
('España', 'Bélgica', '🇪🇸', '🇧🇪', '2026-06-18', '20:00', 'Fase de Grupos - Grupo F', 'disabled'),
('Portugal', 'Italia', '🇵🇹', '🇮🇹', '2026-06-18', '17:00', 'Fase de Grupos - Grupo F', 'disabled'),
('España', 'Italia', '🇪🇸', '🇮🇹', '2026-06-22', '20:00', 'Fase de Grupos - Grupo F', 'disabled'),
('Portugal', 'Bélgica', '🇵🇹', '🇧🇪', '2026-06-22', '20:00', 'Fase de Grupos - Grupo F', 'disabled');

-- GROUP G: Países Bajos, Turquía, Croacia, Serbia
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Países Bajos', 'Turquía', '🇳🇱', '🇹🇷', '2026-06-14', '11:00', 'Fase de Grupos - Grupo G', 'disabled'),
('Croacia', 'Serbia', '🇭🇷', '🇷🇸', '2026-06-14', '14:00', 'Fase de Grupos - Grupo G', 'disabled'),
('Países Bajos', 'Croacia', '🇳🇱', '🇭🇷', '2026-06-18', '14:00', 'Fase de Grupos - Grupo G', 'disabled'),
('Turquía', 'Serbia', '🇹🇷', '🇷🇸', '2026-06-18', '11:00', 'Fase de Grupos - Grupo G', 'disabled'),
('Países Bajos', 'Serbia', '🇳🇱', '🇷🇸', '2026-06-22', '16:00', 'Fase de Grupos - Grupo G', 'disabled'),
('Turquía', 'Croacia', '🇹🇷', '🇭🇷', '2026-06-22', '16:00', 'Fase de Grupos - Grupo G', 'disabled');

-- GROUP H: Marruecos, Senegal, Camerún, Sudáfrica
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Marruecos', 'Senegal', '🇲🇦', '🇸🇳', '2026-06-15', '11:00', 'Fase de Grupos - Grupo H', 'disabled'),
('Camerún', 'Sudáfrica', '🇨🇲', '🇿🇦', '2026-06-15', '14:00', 'Fase de Grupos - Grupo H', 'disabled'),
('Marruecos', 'Camerún', '🇲🇦', '🇨🇲', '2026-06-19', '14:00', 'Fase de Grupos - Grupo H', 'disabled'),
('Senegal', 'Sudáfrica', '🇸🇳', '🇿🇦', '2026-06-19', '11:00', 'Fase de Grupos - Grupo H', 'disabled'),
('Marruecos', 'Sudáfrica', '🇲🇦', '🇿🇦', '2026-06-23', '20:00', 'Fase de Grupos - Grupo H', 'disabled'),
('Senegal', 'Camerún', '🇸🇳', '🇨🇲', '2026-06-23', '20:00', 'Fase de Grupos - Grupo H', 'disabled');

-- GROUP I: Japón, Corea del Sur, Irán, Arabia Saudita
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Japón', 'Corea del Sur', '🇯🇵', '🇰🇷', '2026-06-15', '20:00', 'Fase de Grupos - Grupo I', 'disabled'),
('Irán', 'Arabia Saudita', '🇮🇷', '🇸🇦', '2026-06-15', '17:00', 'Fase de Grupos - Grupo I', 'disabled'),
('Japón', 'Irán', '🇯🇵', '🇮🇷', '2026-06-19', '17:00', 'Fase de Grupos - Grupo I', 'disabled'),
('Corea del Sur', 'Arabia Saudita', '🇰🇷', '🇸🇦', '2026-06-19', '20:00', 'Fase de Grupos - Grupo I', 'disabled'),
('Japón', 'Arabia Saudita', '🇯🇵', '🇸🇦', '2026-06-23', '16:00', 'Fase de Grupos - Grupo I', 'disabled'),
('Corea del Sur', 'Irán', '🇰🇷', '🇮🇷', '2026-06-23', '16:00', 'Fase de Grupos - Grupo I', 'disabled');

-- GROUP J: Uruguay, Canadá, Honduras, Guatemala
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Uruguay', 'Canadá', '🇺🇾', '🇨🇦', '2026-06-16', '17:00', 'Fase de Grupos - Grupo J', 'disabled'),
('Honduras', 'Guatemala', '🇭🇳', '🇬🇹', '2026-06-16', '20:00', 'Fase de Grupos - Grupo J', 'disabled'),
('Uruguay', 'Honduras', '🇺🇾', '🇭🇳', '2026-06-20', '14:00', 'Fase de Grupos - Grupo J', 'disabled'),
('Canadá', 'Guatemala', '🇨🇦', '🇬🇹', '2026-06-20', '11:00', 'Fase de Grupos - Grupo J', 'disabled'),
('Uruguay', 'Guatemala', '🇺🇾', '🇬🇹', '2026-06-24', '16:00', 'Fase de Grupos - Grupo J', 'disabled'),
('Canadá', 'Honduras', '🇨🇦', '🇭🇳', '2026-06-24', '16:00', 'Fase de Grupos - Grupo J', 'disabled');

-- GROUP K: Suiza, Suecia, Austria, Rumanía
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Suiza', 'Suecia', '🇨🇭', '🇸🇪', '2026-06-17', '11:00', 'Fase de Grupos - Grupo K', 'disabled'),
('Austria', 'Rumanía', '🇦🇹', '🇷🇴', '2026-06-17', '14:00', 'Fase de Grupos - Grupo K', 'disabled'),
('Suiza', 'Austria', '🇨🇭', '🇦🇹', '2026-06-21', '11:00', 'Fase de Grupos - Grupo K', 'disabled'),
('Suecia', 'Rumanía', '🇸🇪', '🇷🇴', '2026-06-21', '14:00', 'Fase de Grupos - Grupo K', 'disabled'),
('Suiza', 'Rumanía', '🇨🇭', '🇷🇴', '2026-06-25', '16:00', 'Fase de Grupos - Grupo K', 'disabled'),
('Suecia', 'Austria', '🇸🇪', '🇦🇹', '2026-06-25', '16:00', 'Fase de Grupos - Grupo K', 'disabled');

-- GROUP L: Qatar, Ucrania, Albania, Eslovenia
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Qatar', 'Ucrania', '🇶🇦', '🇺🇦', '2026-06-18', '20:00', 'Fase de Grupos - Grupo L', 'disabled'),
('Albania', 'Eslovenia', '🇦🇱', '🇸🇮', '2026-06-18', '17:00', 'Fase de Grupos - Grupo L', 'disabled'),
('Qatar', 'Albania', '🇶🇦', '🇦🇱', '2026-06-22', '14:00', 'Fase de Grupos - Grupo L', 'disabled'),
('Ucrania', 'Eslovenia', '🇺🇦', '🇸🇮', '2026-06-22', '11:00', 'Fase de Grupos - Grupo L', 'disabled'),
('Qatar', 'Eslovenia', '🇶🇦', '🇸🇮', '2026-06-26', '16:00', 'Fase de Grupos - Grupo L', 'disabled'),
('Ucrania', 'Albania', '🇺🇦', '🇦🇱', '2026-06-26', '16:00', 'Fase de Grupos - Grupo L', 'disabled');

-- OCTAVOS DE FINAL (16 matches)
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, notes, status) values
('1A', '2B', '🏆', '🏆', '2026-07-02', '14:00', 'Octavos de Final', 'Ganador A vs Segundo B', 'disabled'),
('1C', '2D', '🏆', '🏆', '2026-07-02', '20:00', 'Octavos de Final', 'Ganador C vs Segundo D', 'disabled'),
('1E', '2F', '🏆', '🏆', '2026-07-03', '14:00', 'Octavos de Final', 'Ganador E vs Segundo F', 'disabled'),
('1G', '2H', '🏆', '🏆', '2026-07-03', '20:00', 'Octavos de Final', 'Ganador G vs Segundo H', 'disabled'),
('1B', '2A', '🏆', '🏆', '2026-07-04', '14:00', 'Octavos de Final', 'Ganador B vs Segundo A', 'disabled'),
('1D', '2C', '🏆', '🏆', '2026-07-04', '20:00', 'Octavos de Final', 'Ganador D vs Segundo C', 'disabled'),
('1F', '2E', '🏆', '🏆', '2026-07-05', '14:00', 'Octavos de Final', 'Ganador F vs Segundo E', 'disabled'),
('1H', '2G', '🏆', '🏆', '2026-07-05', '20:00', 'Octavos de Final', 'Ganador H vs Segundo G', 'disabled'),
('1I', '2J', '🏆', '🏆', '2026-07-06', '14:00', 'Octavos de Final', 'Ganador I vs Segundo J', 'disabled'),
('1K', '2L', '🏆', '🏆', '2026-07-06', '20:00', 'Octavos de Final', 'Ganador K vs Segundo L', 'disabled'),
('1J', '2I', '🏆', '🏆', '2026-07-07', '14:00', 'Octavos de Final', 'Ganador J vs Segundo I', 'disabled'),
('1L', '2K', '🏆', '🏆', '2026-07-07', '20:00', 'Octavos de Final', 'Ganador L vs Segundo K', 'disabled'),
('3°1', '3°2', '🏆', '🏆', '2026-07-08', '14:00', 'Octavos de Final', 'Mejores terceros', 'disabled'),
('3°3', '3°4', '🏆', '🏆', '2026-07-08', '20:00', 'Octavos de Final', 'Mejores terceros', 'disabled'),
('3°5', '3°6', '🏆', '🏆', '2026-07-09', '14:00', 'Octavos de Final', 'Mejores terceros', 'disabled'),
('3°7', '3°8', '🏆', '🏆', '2026-07-09', '20:00', 'Octavos de Final', 'Mejores terceros', 'disabled');

-- CUARTOS DE FINAL (8 matches)
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('GC-Q1', 'GC-Q2', '🏆', '🏆', '2026-07-14', '14:00', 'Cuartos de Final', 'disabled'),
('GC-Q3', 'GC-Q4', '🏆', '🏆', '2026-07-14', '20:00', 'Cuartos de Final', 'disabled'),
('GC-Q5', 'GC-Q6', '🏆', '🏆', '2026-07-15', '14:00', 'Cuartos de Final', 'disabled'),
('GC-Q7', 'GC-Q8', '🏆', '🏆', '2026-07-15', '20:00', 'Cuartos de Final', 'disabled'),
('GC-Q9', 'GC-Q10', '🏆', '🏆', '2026-07-16', '14:00', 'Cuartos de Final', 'disabled'),
('GC-Q11', 'GC-Q12', '🏆', '🏆', '2026-07-16', '20:00', 'Cuartos de Final', 'disabled'),
('GC-Q13', 'GC-Q14', '🏆', '🏆', '2026-07-17', '14:00', 'Cuartos de Final', 'disabled'),
('GC-Q15', 'GC-Q16', '🏆', '🏆', '2026-07-17', '20:00', 'Cuartos de Final', 'disabled');

-- SEMIFINALES (4 matches)
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('SF-G1', 'SF-G2', '🏆', '🏆', '2026-07-21', '20:00', 'Semifinal', 'disabled'),
('SF-G3', 'SF-G4', '🏆', '🏆', '2026-07-22', '20:00', 'Semifinal', 'disabled'),
('SF-G5', 'SF-G6', '🏆', '🏆', '2026-07-23', '20:00', 'Semifinal', 'disabled'),
('SF-G7', 'SF-G8', '🏆', '🏆', '2026-07-24', '20:00', 'Semifinal', 'disabled');

-- TERCER LUGAR
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, status) values
('Perdedor SF1', 'Perdedor SF2', '🥉', '🥉', '2026-07-28', '15:00', 'Tercer Lugar', 'disabled'),
('Perdedor SF3', 'Perdedor SF4', '🥉', '🥉', '2026-07-28', '20:00', 'Tercer Lugar', 'disabled');

-- FINALES
insert into matches (team_a, team_b, flag_a, flag_b, match_date, match_time, phase, notes, status) values
('Ganador SF1', 'Ganador SF2', '🏆', '🏆', '2026-07-29', '20:00', 'Final', 'Gran Final Copa del Mundo 2026', 'disabled'),
('Ganador SF3', 'Ganador SF4', '🏆', '🏆', '2026-07-30', '16:00', 'Final', 'Gran Final Copa del Mundo 2026', 'disabled');

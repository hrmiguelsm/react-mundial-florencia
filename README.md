# React Mundial Florencia 🏆⚽

Plataforma de gestión de transmisiones y participantes (reacters) para las reacciones en vivo del **FIFA World Cup 2026** de **Florencia Digital**.

## Características

- **Portal Reacters**: Login con RUT chileno, perfil personal/dupla, inscripción a partidos
- **Panel Admin**: CRUD completo de partidos, reacters, RUTs autorizados e inscripciones
- **Modo Demo**: Funciona sin Supabase usando localStorage
- **Export Excel**: Todas las listas exportables a .xlsx
- **Import CSV**: Importación masiva de RUTs y partidos
- **Responsive**: Mobile-first, funciona en móvil y desktop

## Tech Stack

- React 18 + Vite
- Tailwind CSS (tema navy/gold)
- Supabase (client-only)
- React Router v6
- lucide-react (iconos)
- xlsx + file-saver (exports)

## Setup Local

```bash
cd react-mundial-florencia
npm install
npm run dev
```

La app funciona inmediatamente en **Modo Demo** sin configuración.

## Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar `database/schema.sql` en el SQL Editor
3. Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

4. Editar `.env`:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

5. Reiniciar el servidor de desarrollo

## Deploy en Vercel

1. Push el repo a GitHub
2. Importar en [vercel.com](https://vercel.com)
3. Agregar las variables de entorno en Settings > Environment Variables
4. Deploy

El `vercel.json` ya maneja el routing de SPA.

## Credenciales

### Admin Panel
- URL: `/admin`
- Usuario: `florenciadigital`
- Contraseña: `odin`

### RUTs Demo (Modo Demo)
- `12.345.678-9` — Juan Pérez Demo
- `98.765.432-1` — María González Demo
- `11.111.111-1` — Carlos Soto Demo

## Estructura del Proyecto

```
src/
├── App.jsx                    # Router principal
├── main.jsx
├── index.css                  # Tailwind + animaciones custom
├── contexts/
│   └── AuthContext.jsx        # Sesión reacter + admin
├── lib/
│   ├── supabase.js            # Cliente Supabase + detección demo
│   └── demoStorage.js         # localStorage CRUD para modo demo
├── utils/
│   └── rut.js                 # Validación/formato RUT chileno
├── data/
│   └── worldcupMatches.js     # 104 partidos FIFA World Cup 2026
└── pages/
    ├── Landing.jsx
    ├── ReacterLogin.jsx
    ├── ReacterProfile.jsx
    ├── ReacterDashboard.jsx
    ├── AdminLogin.jsx
    └── admin/
        ├── AdminLayout.jsx
        ├── MatchesAdmin.jsx
        ├── ReactersAdmin.jsx
        ├── AuthorizedRuts.jsx
        ├── Registrations.jsx
        └── Settings.jsx
database/
└── schema.sql                 # Schema completo Supabase + datos iniciales
```

## Grupos FIFA World Cup 2026

| Grupo | Equipos |
|-------|---------|
| A | México, Jamaica, Ecuador, Venezuela |
| B | USA, Panama, Bolivia, Nueva Zelanda |
| C | Argentina, Chile, Perú, Australia |
| D | Brasil, Colombia, Paraguay, Costa Rica |
| E | Francia, Inglaterra, Alemania, Polonia |
| F | España, Portugal, Bélgica, Italia |
| G | Países Bajos, Turquía, Croacia, Serbia |
| H | Marruecos, Senegal, Camerún, Sudáfrica |
| I | Japón, Corea del Sur, Irán, Arabia Saudita |
| J | Uruguay, Canadá, Honduras, Guatemala |
| K | Suiza, Suecia, Austria, Rumanía |
| L | Qatar, Ucrania, Albania, Eslovenia |

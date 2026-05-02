# HealthPing 🏥

**Tu ping a la salud** — Marketplace de servicios hospitalarios orientado por síntomas.

Describe tu síntoma → compara hospitales con precios reales → agenda tu cita en minutos.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- **Database:** Supabase (PostgreSQL) + Drizzle ORM
- **Deploy:** Vercel
- **Arquitectura:** Monolito modular, edge-first, event-driven

## Setup

```bash
# 1. Clonar e instalar
git clone https://github.com/TU-USUARIO/healthping.git
cd healthping
npm install

# 2. Configurar env
cp .env.example .env.local
# Editar .env.local con tu Supabase DATABASE_URL

# 3. Generar y aplicar schema a DB
npx drizzle-kit generate
npx drizzle-kit push

# 4. Desarrollo
npm run dev
```

## Scripts

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Desarrollo (localhost:3000) |
| `npm run build` | Build producción |
| `npx drizzle-kit generate` | Generar migraciones |
| `npx drizzle-kit push` | Aplicar schema a DB |
| `npx drizzle-kit studio` | UI visual de la DB |

## Deploy en Vercel

1. Push a GitHub
2. Conectar repo en vercel.com
3. Agregar env variable `DATABASE_URL`
4. Deploy automático

---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> Per AGENTS.md: this is a newer Next.js (16.x, App Router, Turbopack) with breaking changes. Read `node_modules/next/dist/docs/` before writing framework code. Notably, `cookies()` from `next/headers` is **async** (`await cookies()`).

## Commands

```bash
npm run dev            # dev server (http://localhost:3000)
npm run build          # prisma generate && next build
npm run lint           # eslint
npm run migrate        # prisma migrate dev (creates+applies a migration; pass -- --name x)
npm run migrate:deploy # apply committed migrations (production)
npm run migrate:status # show migration state
npm run db:seed        # upsert the admin login account (prisma/seed.ts)
npm run db:push        # push schema without migrations (quick dev sync)
npm run db:studio      # Prisma Studio
```

There is no test framework configured. Verify changes with `npx tsc --noEmit` and `npm run lint`.

Fresh DB setup: `npm run migrate -- --name init` then `npm run db:seed`.

## Environment

- `DATABASE_URL` lives in **`.env`** (read by both the Prisma CLI and Next.js). It currently points at a hosted Prisma Postgres instance, so migrate/seed run against the cloud DB.
- App secrets live in **`.env.local`** (read by Next.js only): `AUTH_SECRET` (>=32 chars, session signing), `ADMIN_EMAILS` (comma-separated allowlist), and the (currently unused) Razorpay keys.

## Architecture

Next.js App Router + **Prisma 6 / Postgres**. Auth is **hand-rolled** (no NextAuth/Supabase) — this project was migrated off Supabase, so it owns both data and auth.

### Auth (custom JWT in an httpOnly cookie)
- [lib/auth.ts](lib/auth.ts) is the core: `bcryptjs` password hashing + `jose` JWT signed with `AUTH_SECRET`, stored in the `nyfs_session` httpOnly cookie. `getSession()` reads/verifies it; `setSessionCookie()`/`clearSessionCookie()` mutate it (call only from Route Handlers).
- [lib/adminAuth.ts](lib/adminAuth.ts) `verifyAdmin()` = `getSession()` + check the session email against the `ADMIN_EMAILS` allowlist. All `/api/admin/*` routes gate on it.
- Client pages are client components that `fetch('/api/auth/me')` then the data endpoint. **No bearer tokens** — the cookie is sent automatically. Convention: `401` → `router.replace('/login?next=...')`, `403` → "NOT AUTHORIZED".

### Two separate "user" concepts (do not conflate)
- **`users`** table = admin login accounts **only**. Created via [prisma/seed.ts](prisma/seed.ts), never by the public form. Only seeded admins can log in / reach the dashboard.
- **`registrations`** table = public event signups, standalone (no auth, no password). Written **only** by [app/api/register/route.ts](app/api/register/route.ts). `email` and `whatsapp` are both `@unique`; the route maps the Prisma `P2002` error's `meta.target` to a field-specific 409 message.
- `preregistrations` = landing-page email capture; `announcements` = admin-managed notices.
- The admin email seeded must also be in `ADMIN_EMAILS`, or login succeeds but the dashboard returns 403.

### Recurring gotchas
- **BigInt primary keys**: all models use `BigInt @id @default(autoincrement())`. `JSON.stringify` cannot serialize `bigint`, so every API response converts ids with `.toString()`, and queries by id wrap input with `BigInt(...)`. The JWT `sub` is always a string.
- **Lazy-init external clients**: never construct an SDK client (Razorpay) at module scope with `process.env.X!` — `next build` evaluates route modules and throws on missing env. See [app/api/create-order/route.ts](app/api/create-order/route.ts) (`getRazorpay()` inside the handler). [lib/prisma.ts](lib/prisma.ts) is the Prisma singleton.
- **Prisma is pinned to v6** intentionally — v7 makes driver adapters mandatory and drops `url` from the schema datasource.
- Payments are currently **disabled**: registration is free. The `razorpay` dep and `/api/create-order` are retained but unused.

### Theming & responsiveness
- Design tokens are Tailwind v4 `@theme` variables in [app/globals.css](app/globals.css) (the "Menthe" mint palette for the public site).
- The admin dashboard is re-themed (clean slate/blue) by overriding the `--color-*` tokens inside a scoped `.admin-theme` class applied on [app/dashboard/DashShell.tsx](app/dashboard/DashShell.tsx) — public pages are unaffected.
- Shared admin UI: `DashShell` (chrome) + `DashNav` (tabs) wrap `/dashboard` and `/dashboard/students`; the older `/admin` console uses `AdminTabs`. Both reuse [app/admin/SignupsTable.tsx](app/admin/SignupsTable.tsx) (search/sort/CSV export + a per-row details modal).
- `body { overflow-x: hidden }` and `html { position: relative }` in globals.css are load-bearing: the former clips large offset shadows on mobile; the latter is required by framer-motion's `useScroll` (the document root is its default scroll container).

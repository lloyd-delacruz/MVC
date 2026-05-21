# CMS Setup & Deployment

Technical guide for setting up and deploying the MVC CMS. For day-to-day content
editing, see `CLIENT-GUIDE.md`.

## 1. Required secrets

The CMS needs three environment variables. Create a `.env` file (it is
git-ignored) by copying `.env.example`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | A Postgres database. Create a free database at [Neon](https://neon.tech) (or Vercel → Storage → Postgres) and copy the connection string (include `?sslmode=require`). |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob → create a store → copy the read/write token. Used for image uploads. |
| `AUTH_SECRET` | Generate one: `openssl rand -base64 32`. Signs admin session cookies. |

```bash
cp .env.example .env
# then edit .env and fill in the three values
```

## 2. First-time local setup

```bash
npm install                       # installs deps and runs `prisma generate`
npm run db:push                   # creates the tables in your database
npm run db:seed                   # loads current site content + migrates blog posts
npm run admin:create -- "you@example.com" "Your Name" "a-strong-password"
npm run dev                       # http://localhost:3000  (admin at /admin)
```

- `db:push` syncs the schema without migration files (fastest for getting started).
- `db:seed` is idempotent: singletons are created without overwriting edits,
  collections are only seeded when empty, and blog posts upsert by slug.

## 3. Production migrations (recommended before launch)

For production rigor, switch from `db:push` to versioned migrations:

```bash
npm run db:migrate -- --name init   # creates prisma/migrations and applies it
git add prisma/migrations && git commit -m "chore: initial CMS migration"
```

On deploy, run migrations with `prisma migrate deploy`. On Vercel, set the
**Build Command** to:

```
prisma migrate deploy && next build
```

(`prisma generate` already runs via the `postinstall` script.)

## 4. Deploying to Vercel

1. Add `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, and `AUTH_SECRET` in
   **Vercel → Project → Settings → Environment Variables** (Production +
   Preview).
2. Ensure migrations are committed and the Build Command runs `prisma migrate
   deploy` (see §3), or run `npm run db:push` against the production database
   once.
3. Create the first admin against the production database (run
   `npm run admin:create -- ...` locally with the production `DATABASE_URL`, or
   via a one-off task).
4. Run `npm run db:seed` once against production to load launch content.
5. Visit `/admin/login` over HTTPS and confirm you can sign in (the session
   cookie is `Secure` in production).

## 5. Security checklist

- `.env` is git-ignored — never commit secrets. Verify: `git ls-files | grep -E '^\.env$'` returns nothing.
- Admin routes (`/admin/*` except `/admin/login`) are protected by `middleware.ts` and a `requireUser()` guard in the panel layout.
- Passwords are bcrypt-hashed (cost 12); login has a DB-backed lockout (5 attempts → 15 min).
- The public site has no authentication and no per-request DB cost (reads are cached and revalidated on save).

## 6. How content reaches the site

- **Models:** `prisma/schema.prisma` + `lib/cms/repositories/*` (the only DB callers; reads are cached + fallback-wrapped).
- **Controllers:** server actions in `lib/cms/actions/*`, plus `middleware.ts` and `lib/cms/auth/*`.
- **Views:** the existing public components (now prop-driven) and the admin UI under `app/admin/`.
- **Fallbacks:** every public read falls back to `lib/cms/fallbacks/*` (today's content) if the DB is empty or unreachable, so the site never breaks.
- **Publishing:** saving in the admin calls `revalidateTag`/`revalidatePath`, so changes appear within seconds.

## 7. Troubleshooting

- **Images don't upload:** check `BLOB_READ_WRITE_TOKEN`.
- **Admin pages 500 on save:** check `DATABASE_URL` and that `db:push`/migrations ran.
- **Can't log in:** confirm `AUTH_SECRET` is set and an admin exists (`npm run db:studio` → AdminUser).
- **Public pages show old/default content:** the DB may be empty — run `npm run db:seed`. (Default content rendering is expected/safe when the DB is empty.)

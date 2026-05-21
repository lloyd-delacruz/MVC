# CMS / Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a database-driven, client-editable CMS + authenticated admin panel to the existing MVC Next.js site, replacing hardcoded content with DB content backed by fallbacks, without changing the public design.

**Architecture:** MVC layering inside Next.js 14 App Router — **Models** = Prisma schema + `lib/cms/repositories/*` (the only DB callers; reads are cached + fallback-wrapped); **Controllers** = Server Actions in `lib/cms/actions/*` + `middleware.ts` + auth helpers; **Views** = existing public components (refactored to take props, markup unchanged) + new admin views under `app/admin/*`. Edits publish instantly via `revalidateTag`.

**Tech Stack:** Next.js 14, TypeScript, Tailwind, Prisma + Neon Postgres, Vercel Blob, Zod, `bcryptjs`, `jose`, `sharp`, Vitest (unit/logic tests).

---

## How to use this plan

- Work top to bottom. Each **Phase** ends with a **Checkpoint** — do not start the next phase until the checkpoint passes.
- Every task follows TDD: write failing test → run (fail) → implement → run (pass) → commit.
- Phase 0 and Task 1.1 (Hero) are written in full step detail and establish the six **Repeating Patterns** below. Later module tasks give the exact module-specific content (Prisma model, fallback values, Zod schema, form fields, public wiring target, test names) and say "follow Pattern X" for the mechanical parts — the patterns ARE the full code, written once here.
- Commit after every task. Use `feat:`, `test:`, `chore:` prefixes.

## Repeating Patterns (read once, referenced throughout)

These are complete reference implementations. Module tasks reference them by letter.

### Pattern A — Cached + fallback repository read (Model)

```ts
// lib/cms/cache.ts
import { unstable_cache } from "next/cache";

/** Wrap a DB read so results are cached and bustable by tag. */
export function cached<T>(fn: () => Promise<T>, keyParts: string[], tags: string[]) {
  return unstable_cache(fn, keyParts, { tags });
}
```

```ts
// lib/cms/repositories/<module>.ts  (read shape)
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { <MODULE>_FALLBACK } from "@/lib/cms/fallbacks/<module>";
import type { <Module>Content } from "@/lib/cms/types";

// The try/catch is the fallback guarantee: an empty OR unreachable DB
// must NEVER throw out of a read, or the public page crashes.
export const get<Module> = cached(
  async (): Promise<<Module>Content> => {
    try {
      const row = await prisma.<model>.findUnique({ where: { id: "singleton" } });
      return row ? map<Module>(row) : <MODULE>_FALLBACK;
    } catch {
      return <MODULE>_FALLBACK;
    }
  },
  ["cms:<module>"],
  ["cms:<module>"],
);
```

Collections use `findMany({ where: { published: true }, orderBy: { order: "asc" } })` and return `[]`-vs-fallback as specified per module. Admin reads (which need drafts too) are a separate **non-cached** function `get<Module>ForAdmin()` that returns all rows and rethrows nothing special (admin can see errors).

### Pattern B — Zod schema (shared by form + action)

```ts
// lib/cms/validation/<module>.ts
import { z } from "zod";

export const <module>Schema = z.object({
  field: z.string().trim().min(1, "Required").max(200),
  // urls: z.string().trim().url().or(z.literal("")),
  // images stored as URL strings; file handling happens in the action, not here
});
export type <Module>Input = z.infer<typeof <module>Schema>;
```

### Pattern C — Server Action (Controller)

```ts
// lib/cms/actions/<module>.ts
"use server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { <module>Schema } from "@/lib/cms/validation/<module>";
import { sanitizeText } from "@/lib/cms/sanitize";

export type ActionState = { ok: boolean; errors?: Record<string, string[]>; message?: string };

function formToObject(fd: FormData): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) if (!(v instanceof File)) o[k] = v;
  return o;
}

export async function save<Module>(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser(); // throws/redirects if not authenticated
  const parsed = <module>Schema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const d = parsed.data;
  await prisma.<model>.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", field: sanitizeText(d.field) },
    update: { field: sanitizeText(d.field) },
  });

  revalidateTag("cms:<module>");
  return { ok: true, message: "Saved." };
}
```

### Pattern D — Admin form view (View)

A server component page reads current content via the admin repository function and renders a **client** form component bound to the action with `useActionState`:

```tsx
// app/admin/<module>/page.tsx  (server component)
import { get<Module>ForAdmin } from "@/lib/cms/repositories/<module>";
import { <Module>Form } from "./form";

export default async function Page() {
  const data = await get<Module>ForAdmin();
  return <<Module>Form initial={data} />;
}
```

```tsx
// app/admin/<module>/form.tsx  ("use client")
"use client";
import { useActionState } from "react";
import { save<Module>, type ActionState } from "@/lib/cms/actions/<module>";
import { Field, SubmitBar } from "@/components/admin/Form"; // shared admin form primitives

const initialState: ActionState = { ok: false };

export function <Module>Form({ initial }: { initial: any }) {
  const [state, action, pending] = useActionState(save<Module>, initialState);
  return (
    <form action={action} className="space-y-5">
      <Field name="field" label="Field" defaultValue={initial?.field} error={state.errors?.field} />
      <SubmitBar pending={pending} state={state} />
    </form>
  );
}
```

### Pattern E — Public wiring (View, design unchanged)

1. Refactor the existing component so all hardcoded constants become props with the **same shape** (keep the JSX/classes byte-for-byte identical; only swap the data source).
2. The server `page.tsx` calls the repository and passes props.

```tsx
// before: const guarantees = [...]; export function Hero() { ...uses guarantees... }
// after:
export function Hero({ content }: { content: HeroContent }) {
  const { guarantees, headline /* ... */ } = content;
  // identical JSX, now reading from `content`
}
```

### Pattern F — TDD rhythm (every task)

write failing test → `npm test -- <file>` shows FAIL → implement minimal code → `npm test -- <file>` shows PASS → `git add` + `git commit`.

### Naming contract (used across all tasks)

- DB client: `lib/cms/db.ts` → `prisma`
- Cache: `lib/cms/cache.ts` → `cached(fn, keyParts, tags)`
- Auth: `lib/cms/auth/password.ts` → `hashPassword`, `verifyPassword`; `lib/cms/auth/session.ts` → `SESSION_COOKIE`, `createSession`, `verifySession`, `getCurrentUser`, `requireUser`, `destroySession`
- Icons: `lib/cms/icons.ts` → `ICON_NAMES`, `resolveIcon(name)`
- Images: `lib/cms/images.ts` → `validateImageFile(file)`, `uploadImage(file, folder)`
- Sanitize: `lib/cms/sanitize.ts` → `sanitizeText`, `sanitizeMarkdown`, `sanitizeUrl`
- Types: `lib/cms/types.ts`
- Singleton row id: the string `"singleton"`
- Revalidation tags: `cms:hero`, `cms:services`, `cms:team`, `cms:homepage-extras`, `cms:about`, `cms:contact`, `cms:testimonials`, `cms:faqs`, `cms:blog`, `cms:seo`

---

# PHASE 0 — Foundation & Infrastructure

Goal: tooling, DB, auth, admin shell, and the reusable Model/Controller helpers, with nothing module-specific yet.

### Task 0.1: Install dependencies and test tooling

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `lib/cms/.gitkeep`

- [ ] **Step 1: Install runtime + dev deps**

Run:
```bash
npm install @prisma/client @vercel/blob zod bcryptjs jose sharp
npm install -D prisma vitest vite-tsconfig-paths @types/bcryptjs tsx
```

- [ ] **Step 2: Add scripts to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"db:push": "prisma db push",
"db:migrate": "prisma migrate dev",
"db:studio": "prisma studio",
"admin:create": "tsx scripts/create-admin.ts",
"db:seed": "tsx scripts/seed-cms.ts"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: "node", include: ["**/*.test.ts"], globals: true },
});
```

- [ ] **Step 4: Sanity test**

Create `lib/cms/smoke.test.ts`:
```ts
import { it, expect } from "vitest";
it("vitest runs", () => expect(1 + 1).toBe(2));
```
Run: `npm test` → Expected: 1 passed. Then delete `lib/cms/smoke.test.ts`.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "chore: add CMS dependencies and vitest setup"
```

### Task 0.2: Prisma init, AdminUser model, DB client singleton

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/cms/db.ts`
- Create: `.env.example`
- Modify: `.gitignore` (ensure `.env` ignored — `.env*.local` already is; add `.env`)

- [ ] **Step 1: Create `prisma/schema.prisma`**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id             String    @id @default(cuid())
  email          String    @unique
  passwordHash   String
  name           String
  failedAttempts Int       @default(0)
  lockedUntil    DateTime?
  createdAt      DateTime  @default(now())
}
```

- [ ] **Step 2: Create `lib/cms/db.ts`** (singleton to avoid hot-reload connection storms)
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Create `.env.example`**
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
AUTH_SECRET="generate-with: openssl rand -base64 32"
```

- [ ] **Step 4: Add `.env` to `.gitignore`** (append a line `.env`).

- [ ] **Step 5: Set up a local dev DB** — create a free Neon database (or local Postgres), put its URL in `.env` as `DATABASE_URL`, then run:
```bash
npx prisma generate && npm run db:push
```
Expected: "Your database is now in sync with your Prisma schema."

- [ ] **Step 6: Commit**
```bash
git add prisma lib/cms/db.ts .env.example .gitignore && git commit -m "feat: add Prisma, AdminUser model, db client"
```

### Task 0.3: Password hashing

**Files:**
- Create: `lib/cms/auth/password.ts`
- Test: `lib/cms/auth/password.test.ts`

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("hashes and verifies a correct password", async () => {
    const hash = await hashPassword("s3cret!");
    expect(hash).not.toBe("s3cret!");
    expect(await verifyPassword("s3cret!", hash)).toBe(true);
  });
  it("rejects a wrong password", async () => {
    const hash = await hashPassword("s3cret!");
    expect(await verifyPassword("nope", hash)).toBe(false);
  });
});
```
- [ ] **Step 2: Run** `npm test -- password` → FAIL (module not found).
- [ ] **Step 3: Implement**
```ts
import bcrypt from "bcryptjs";
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```
- [ ] **Step 4: Run** `npm test -- password` → PASS.
- [ ] **Step 5: Commit** `git add lib/cms/auth && git commit -m "feat: password hashing"`

### Task 0.4: Session tokens (JWT cookie)

**Files:**
- Create: `lib/cms/auth/session.ts`
- Test: `lib/cms/auth/session.test.ts`

- [ ] **Step 1: Failing test** (pure token functions; cookie/redirect helpers tested via middleware checkpoint)
```ts
import { describe, it, expect, beforeAll } from "vitest";
import { signSession, verifySessionToken } from "./session";

beforeAll(() => { process.env.AUTH_SECRET = "test-secret-test-secret-test-secret"; });

describe("session token", () => {
  it("round-trips a valid token", async () => {
    const token = await signSession({ sub: "user-1", email: "a@b.com" });
    const payload = await verifySessionToken(token);
    expect(payload?.email).toBe("a@b.com");
  });
  it("returns null for a tampered token", async () => {
    expect(await verifySessionToken("garbage.token.here")).toBeNull();
  });
});
```
- [ ] **Step 2: Run** `npm test -- session` → FAIL.
- [ ] **Step 3: Implement `lib/cms/auth/session.ts`**
```ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "mvc_admin_session";
const ALG = "HS256";
const MAX_AGE = 60 * 60 * 8; // 8h

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export type SessionPayload = { sub: string; email: string };

export async function signSession(p: SessionPayload): Promise<string> {
  return new SignJWT({ email: p.email })
    .setProtectedHeader({ alg: ALG })
    .setSubject(p.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return { sub: String(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}

export async function createSession(p: SessionPayload): Promise<void> {
  const token = await signSession(p);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function requireUser(): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
```
- [ ] **Step 4: Run** `npm test -- session` → PASS.
- [ ] **Step 5: Commit** `git add lib/cms/auth && git commit -m "feat: JWT session tokens"`

### Task 0.5: Middleware to protect `/admin/*`

**Files:**
- Create: `middleware.ts` (project root)
- Test: `middleware.test.ts`

- [ ] **Step 1: Failing test** (test the pure decision helper, not the Next runtime)

Put the decision logic in a tiny pure function so it's unit-testable:
```ts
// middleware.test.ts
import { describe, it, expect } from "vitest";
import { isProtected } from "./middleware";
describe("isProtected", () => {
  it("protects /admin and subpaths", () => {
    expect(isProtected("/admin")).toBe(true);
    expect(isProtected("/admin/hero")).toBe(true);
  });
  it("does not protect the login page or public site", () => {
    expect(isProtected("/admin/login")).toBe(false);
    expect(isProtected("/")).toBe(false);
    expect(isProtected("/blog")).toBe(false);
  });
});
```
- [ ] **Step 2: Run** `npm test -- middleware` → FAIL.
- [ ] **Step 3: Implement `middleware.ts`**
```ts
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/cms/auth/session";

export function isProtected(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

export async function middleware(req: NextRequest) {
  if (!isProtected(req.nextUrl.pathname)) return NextResponse.next();
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = token ? await verifySessionToken(token) : null;
  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
```
- [ ] **Step 4: Run** `npm test -- middleware` → PASS.
- [ ] **Step 5: Commit** `git add middleware.ts && git commit -m "feat: protect /admin with middleware"`

### Task 0.6: Create-admin script

**Files:**
- Create: `scripts/create-admin.ts`

- [ ] **Step 1: Implement** (interactive via CLI args)
```ts
import { prisma } from "@/lib/cms/db";
import { hashPassword } from "@/lib/cms/auth/password";

async function main() {
  const [, , email, name, password] = process.argv;
  if (!email || !name || !password) {
    console.error('Usage: npm run admin:create -- "email" "Full Name" "password"');
    process.exit(1);
  }
  const passwordHash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email }, update: { passwordHash, name }, create: { email, name, passwordHash },
  });
  console.log(`Admin ready: ${email}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
```
- [ ] **Step 2: Run it** `npm run admin:create -- "you@example.com" "Site Admin" "ChangeMe123!"` → Expected: "Admin ready: ...". Verify with `npm run db:studio` (AdminUser has 1 row).
- [ ] **Step 3: Commit** `git add scripts && git commit -m "feat: create-admin script"`

### Task 0.7: Login action + login page + sign-out

**Files:**
- Create: `lib/cms/actions/auth.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/login/form.tsx`
- Create: `lib/cms/validation/auth.ts`

- [ ] **Step 1: Validation schema** `lib/cms/validation/auth.ts`
```ts
import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
```
- [ ] **Step 2: Login + logout actions** `lib/cms/actions/auth.ts`
```ts
"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/cms/db";
import { verifyPassword } from "@/lib/cms/auth/password";
import { createSession, destroySession } from "@/lib/cms/auth/session";
import { loginSchema } from "@/lib/cms/validation/auth";

export type LoginState = { error?: string };

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { error: "Invalid email or password." };
  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });

  // DB-backed lockout (serverless-safe, unlike in-memory rate limiting)
  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) {
    if (user) {
      const attempts = user.failedAttempts + 1;
      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedAttempts: attempts,
          lockedUntil: attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
        },
      });
    }
    return { error: "Invalid email or password." }; // generic message — no user enumeration
  }

  await prisma.adminUser.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null } });
  await createSession({ sub: user.id, email: user.email });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
```
- [ ] **Step 3: Login form** `app/admin/login/form.tsx` (`"use client"`, uses `useActionState(login, {})`, email + password inputs, shows `state.error`). Style with Tailwind (simple centered card; admin styling, not public design).
- [ ] **Step 4: Login page** `app/admin/login/page.tsx` (server component rendering `<LoginForm/>`; if already logged in, redirect to `/admin`).
- [ ] **Step 5: Manual verify** `npm run dev`, visit `/admin` → redirected to `/admin/login`; log in with the seeded admin → lands on `/admin` (will 404 until Task 0.8 — that's fine, confirm the redirect + cookie set in devtools).
- [ ] **Step 6: Commit** `git add app/admin lib/cms/actions/auth.ts lib/cms/validation/auth.ts && git commit -m "feat: admin login and logout"`

### Task 0.8: Admin shell + dashboard + shared form primitives

**Files:**
- Create: `app/admin/layout.tsx` (sidebar nav to every module + sign-out button calling `logout`)
- Create: `app/admin/page.tsx` (dashboard: links/cards to each module)
- Create: `components/admin/Form.tsx` (`Field`, `Textarea`, `MarkdownField`, `ImageField`, `SelectField`, `SubmitBar` primitives + inline error display)
- Create: `components/admin/Nav.tsx`

- [ ] **Step 1:** Build the admin layout. It must NOT import the public `Header`/`Footer`. Wrap children in a sidebar grid. Sidebar links: Dashboard, Hero, Homepage Extras, About, Services, Team, Testimonials, FAQs, Blog, Contact, SEO, Users. Guard the layout with `await requireUser()` at the top (defense-in-depth beyond middleware).
- [ ] **Step 2:** Build `components/admin/Form.tsx` primitives. `SubmitBar` shows a pending state and success/error message from `ActionState`. `ImageField` is built in Task 0.10. Stub `ImageField` to a plain file input for now.
- [ ] **Step 3: Manual verify** log in → `/admin` shows the dashboard with the sidebar; sign-out returns to login.
- [ ] **Step 4: Commit** `git add app/admin components/admin && git commit -m "feat: admin shell, dashboard, form primitives"`

### Task 0.9: Icon allowlist

**Files:**
- Create: `lib/cms/icons.ts`
- Test: `lib/cms/icons.test.ts`

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from "vitest";
import { resolveIcon, ICON_NAMES } from "./icons";
describe("icons", () => {
  it("resolves a known icon to a component", () => {
    expect(typeof resolveIcon("Stamp")).toBe("object"); // forwardRef component
  });
  it("falls back for an unknown icon", () => {
    expect(resolveIcon("NotARealIcon")).toBe(resolveIcon("__fallback__"));
  });
  it("exposes the allowlist", () => {
    expect(ICON_NAMES).toContain("Stamp");
  });
});
```
- [ ] **Step 2: Run** `npm test -- icons` → FAIL.
- [ ] **Step 3: Implement** — import only the icons actually used across the site (Stamp, Heart, GraduationCap, Briefcase, ShieldCheck, UserRound, ScrollText, Users, Star, MessageCircle, Phone, Mail, MapPin, Clock, Languages, CalendarDays, CreditCard) plus a fallback (`HelpCircle`). Map name→component, `ICON_NAMES = Object.keys(map)`, `resolveIcon(name)` returns map[name] ?? fallback; `resolveIcon("__fallback__")` returns fallback.
- [ ] **Step 4: Run** `npm test -- icons` → PASS.
- [ ] **Step 5: Commit** `git add lib/cms/icons.ts* && git commit -m "feat: lucide icon allowlist"`

### Task 0.10: Image validation, optimization, upload pipeline

**Files:**
- Create: `lib/cms/images.ts`
- Test: `lib/cms/images.test.ts`
- Create: `components/admin/ImageField.tsx` (wire into `components/admin/Form.tsx`)
- Modify: `next.config.mjs` (add Vercel Blob hostname to `remotePatterns`)

- [ ] **Step 1: Failing test** (test the pure validator; `sharp`/blob are integration-verified at checkpoint)
```ts
import { describe, it, expect } from "vitest";
import { validateImageFile } from "./images";
function fakeFile(type: string, size: number): File {
  return { type, size, name: "x" } as unknown as File;
}
describe("validateImageFile", () => {
  it("accepts a small jpeg", () => {
    expect(validateImageFile(fakeFile("image/jpeg", 1024)).ok).toBe(true);
  });
  it("rejects a non-image", () => {
    expect(validateImageFile(fakeFile("application/pdf", 1024)).ok).toBe(false);
  });
  it("rejects an oversized image", () => {
    expect(validateImageFile(fakeFile("image/png", 6 * 1024 * 1024)).ok).toBe(false);
  });
});
```
- [ ] **Step 2: Run** `npm test -- images` → FAIL.
- [ ] **Step 3: Implement `lib/cms/images.ts`**
```ts
import sharp from "sharp";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): { ok: boolean; error?: string } {
  if (!ALLOWED.includes(file.type)) return { ok: false, error: "Use JPEG, PNG, or WebP." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image must be under 5MB." };
  return { ok: true };
}

/** Validate -> optimize to webp -> upload to Vercel Blob under `folder/`. Returns public URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const check = validateImageFile(file);
  if (!check.ok) throw new Error(check.error);
  const input = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.webp`;
  const { url } = await put(key, optimized, { access: "public", contentType: "image/webp" });
  return url;
}
```
- [ ] **Step 4: Run** `npm test -- images` → PASS.
- [ ] **Step 5: `ImageField` component** — file input + current-image preview + hidden field carrying the existing URL (so unchanged images persist). The owning action reads `fd.get("<name>File")` (a File) and, if present, calls `uploadImage`; otherwise keeps `fd.get("<name>Url")`.
- [ ] **Step 6: Update `next.config.mjs`** add `{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }` to `images.remotePatterns`.
- [ ] **Step 7: Commit** `git add lib/cms/images.ts* components/admin next.config.mjs && git commit -m "feat: image upload + optimization pipeline"`

### Task 0.11: Sanitization helpers

**Files:**
- Create: `lib/cms/sanitize.ts`
- Test: `lib/cms/sanitize.test.ts`

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from "vitest";
import { sanitizeText, sanitizeUrl } from "./sanitize";
describe("sanitize", () => {
  it("trims and strips control chars", () => {
    expect(sanitizeText("  hi there  ")).toBe("hithere");
  });
  it("allows http(s) urls and clears javascript: urls", () => {
    expect(sanitizeUrl("https://x.com")).toBe("https://x.com");
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });
});
```
- [ ] **Step 2: Run** `npm test -- sanitize` → FAIL.
- [ ] **Step 3: Implement** — `sanitizeText` trims + removes ` -`; `sanitizeUrl` returns the url only if it starts with `http://`, `https://`, `/`, `mailto:`, or `tel:`, else `""`; `sanitizeMarkdown` = `sanitizeText` but preserves newlines (strip only ` ` and other control chars except `\n`, `\t`).
- [ ] **Step 4: Run** `npm test -- sanitize` → PASS.
- [ ] **Step 5: Commit** `git add lib/cms/sanitize.ts* && git commit -m "feat: sanitization helpers"`

### ✅ Checkpoint 0 — Foundation

Run and confirm ALL pass:
```bash
npm run lint
npm test
npm run build
```
Manual: `npm run dev` → `/admin` redirects to login; login works; dashboard + sidebar render; sign-out works; `/` (public homepage) is visually unchanged. Markdown rendering on `/blog/*` still works.

**Gate:** Do not proceed until lint + tests + build are green and the manual checks pass.

---

# PHASE 1 — Homepage modules

Establishes the full module vertical (Hero, Task 1.1, in complete detail), then Services, Team, and Homepage Extras. The public `app/page.tsx` becomes a server component that fetches all homepage content and passes it to the (now prop-driven) sections. The `/about` page (which reuses Services/Team/TrustBadges/WhyChoose) must pass the same props.

### Task 1.1: Hero module (FULL detail — the template for all modules)

**Files:**
- Modify: `prisma/schema.prisma` (add `HeroSection`)
- Create: `lib/cms/types.ts` (add `HeroContent`)
- Create: `lib/cms/fallbacks/hero.ts`
- Create: `lib/cms/repositories/hero.ts`
- Test: `lib/cms/repositories/hero.test.ts`
- Create: `lib/cms/validation/hero.ts`
- Create: `lib/cms/actions/hero.ts`
- Create: `app/admin/hero/page.tsx`, `app/admin/hero/form.tsx`
- Modify: `components/sections/Hero.tsx`, `app/page.tsx`, `app/about/page.tsx`

- [ ] **Step 1: Add Prisma model** to `prisma/schema.prisma`:
```prisma
model HeroSection {
  id                String   @id @default("singleton")
  eyebrow           String
  headline          String
  dek               String
  guarantees        String[]
  primaryCtaLabel   String
  primaryCtaHref    String
  secondaryCtaLabel String
  secondaryCtaHref  String
  imageUrl          String
  imageAlt          String
  founderName       String
  founderTitle      String
  founderQuote      String
  updatedAt         DateTime @updatedAt
}
```
Run `npm run db:push` (Expected: in sync).

- [ ] **Step 2: Add `HeroContent` type** to `lib/cms/types.ts`:
```ts
export type HeroContent = {
  eyebrow: string; headline: string; dek: string; guarantees: string[];
  primaryCtaLabel: string; primaryCtaHref: string;
  secondaryCtaLabel: string; secondaryCtaHref: string;
  imageUrl: string; imageAlt: string;
  founderName: string; founderTitle: string; founderQuote: string;
};
```

- [ ] **Step 3: Fallback** `lib/cms/fallbacks/hero.ts` — copy today's exact values from `components/sections/Hero.tsx`:
```ts
import type { HeroContent } from "@/lib/cms/types";
export const HERO_FALLBACK: HeroContent = {
  eyebrow: "Regulated Canadian Immigration Consultant",
  headline: "Canadian immigration guidance you can trust.",
  dek: "Licensed RCIC. Personal review. Real guidance for families, workers, students, and businesses—tailored to your goals.",
  guarantees: ["RCIC Licensed & Regulated", "Proven Results", "Personalized, Honest Advice", "Multilingual Support"],
  primaryCtaLabel: "Book a Free Assessment", primaryCtaHref: "/contact",
  secondaryCtaLabel: "Explore Pathways", secondaryCtaHref: "/pathways",
  imageUrl: "/team/yaniv.png", imageAlt: "Yaniv Babani, Founder & RCIC at My Visa For Canada",
  founderName: "Yaniv Babani", founderTitle: "Founder & RCIC (RCIC: #R519412)",
  founderQuote: "Your immigration goals, our priority.",
};
```
> Note: the current headline has a styled "trust" word + inline maple leaf. Keep the leaf in the JSX as static decoration; the editable `headline` is the plain text. Document this in the field's admin help text.

- [ ] **Step 4: Failing repository test** `lib/cms/repositories/hero.test.ts`
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HERO_FALLBACK } from "@/lib/cms/fallbacks/hero";

vi.mock("@/lib/cms/db", () => ({ prisma: { heroSection: { findUnique: vi.fn() } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: any) => fn })); // bypass cache in tests
import { prisma } from "@/lib/cms/db";
import { getHero } from "./hero";

describe("getHero", () => {
  beforeEach(() => vi.clearAllMocks());
  it("returns fallback when DB is empty", async () => {
    (prisma.heroSection.findUnique as any).mockResolvedValue(null);
    expect(await getHero()).toEqual(HERO_FALLBACK);
  });
  it("returns fallback when DB throws", async () => {
    (prisma.heroSection.findUnique as any).mockRejectedValue(new Error("down"));
    expect(await getHero()).toEqual(HERO_FALLBACK);
  });
  it("returns DB row when present", async () => {
    (prisma.heroSection.findUnique as any).mockResolvedValue({ ...HERO_FALLBACK, headline: "Custom" });
    expect((await getHero()).headline).toBe("Custom");
  });
});
```
- [ ] **Step 5: Run** `npm test -- repositories/hero` → FAIL.
- [ ] **Step 6: Implement `lib/cms/repositories/hero.ts`** (Pattern A) with `getHero` (cached, fallback) + `getHeroForAdmin()` (returns the row or `HERO_FALLBACK`, no cache). Map only the `HeroContent` fields.
- [ ] **Step 7: Run** `npm test -- repositories/hero` → PASS.
- [ ] **Step 8: Validation** `lib/cms/validation/hero.ts` (Pattern B): all strings `min(1)` with sensible max; `guarantees` as a newline-delimited textarea parsed to `string[]` (split on `\n`, trim, drop empties, max 6); hrefs validated with a relaxed url-or-path rule.
- [ ] **Step 9: Action** `lib/cms/actions/hero.ts` (Pattern C): `saveHero`; handle the image via `ImageField` convention (Task 0.10 Step 5); `revalidateTag("cms:hero")`. Sanitize every text field.
- [ ] **Step 10: Admin views** `app/admin/hero/page.tsx` + `form.tsx` (Pattern D): fields for every `HeroContent` property; guarantees as a textarea; `ImageField` for the photo.
- [ ] **Step 11: Public wiring** (Pattern E):
  - Refactor `components/sections/Hero.tsx` to `Hero({ content }: { content: HeroContent })`, replacing the local `guarantees` const and hardcoded strings with `content.*`. **Keep all JSX/classes/the MapleLeaf identical.**
  - `app/page.tsx`: make it `async`, `const hero = await getHero()`, pass `<Hero content={hero} />`.
  - `app/about/page.tsx` does not use `Hero`, so no change here (it has its own PageHero). Leave About hero for Task 2.1.
- [ ] **Step 12: Run** `npm test` (all) → PASS. `npm run build` → succeeds.
- [ ] **Step 13: Manual verify** homepage looks identical with empty Hero table; then in `/admin/hero` change the headline + save → homepage reflects it within seconds.
- [ ] **Step 14: Commit** `git add -A && git commit -m "feat: CMS-editable homepage hero"`

### Task 1.2: Services module

**Files:** add `Service` model; `lib/cms/fallbacks/services.ts`; `repositories/services.ts` (+test); `validation/services.ts`; `actions/services.ts`; `app/admin/services/*`; modify `components/sections/Services.tsx`, `app/page.tsx`, `app/about/page.tsx`.

- [ ] **Step 1: Prisma model**
```prisma
model Service {
  id          String  @id @default(cuid())
  title       String
  description String
  iconName    String
  href        String
  order       Int     @default(0)
  published   Boolean @default(true)
}
```
Run `npm run db:push`.
- [ ] **Step 2: Type** add `ServiceItem = { id; title; description; iconName; href }` to `types.ts`.
- [ ] **Step 3: Fallback** `services.ts` — exact 4 items from `components/sections/Services.tsx` (Express Entry/Stamp/"Skilled worker pathways…"; Family Sponsorship/Heart; Study Permits/GraduationCap; Work Permits/Briefcase), each `href: "#contact"`.
- [ ] **Step 4: Repository test** (Pattern A, collection): `getServices` returns fallback when DB empty OR throws; returns mapped published rows ordered by `order` when present. **Implement** `getServices` (cached, tag `cms:services`) + `getServicesForAdmin()` (all rows incl. unpublished, ordered).
- [ ] **Step 5: Validation** `services.ts`: `title` 1–80, `description` 1–200, `iconName` must be in `ICON_NAMES` (`z.enum`-style refine against the allowlist), `href` url-or-path.
- [ ] **Step 6: Actions** `services.ts`: `createService`, `updateService(id)`, `deleteService(id)`, `reorderServices(ids[])`; each `requireUser()` + sanitize + `revalidateTag("cms:services")`.
- [ ] **Step 7: Admin views** `app/admin/services/page.tsx` (list with order, edit/delete, "Add service") + a form (shared) using `SelectField` for `iconName` (options = `ICON_NAMES`).
- [ ] **Step 8: Public wiring** refactor `components/sections/Services.tsx` to `Services({ items }: { items: ServiceItem[] })`, mapping `resolveIcon(item.iconName)` for the icon; keep markup identical. Pass `items` from `app/page.tsx` and `app/about/page.tsx` (`const services = await getServices()`).
- [ ] **Step 9:** `npm test` + `npm run build` → green. Manual: homepage + about render identically; add/edit/reorder a service in admin reflects on both pages.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable services"`

### Task 1.3: Team module

**Files:** `TeamMember` model; fallbacks/repository(+test)/validation/actions; `app/admin/team/*`; modify `components/sections/Team.tsx`, `app/page.tsx`, `app/about/page.tsx`.

- [ ] **Step 1: Prisma model**
```prisma
model TeamMember {
  id        String  @id @default(cuid())
  name      String
  role      String
  imageUrl  String
  imageAlt  String
  bio       String?
  order     Int     @default(0)
  published Boolean @default(true)
}
```
Run `npm run db:push`.
- [ ] **Step 2: Type** `TeamMemberItem = { id; name; role; imageUrl; imageAlt; bio? }`.
- [ ] **Step 3: Fallback** exact 4 members from `components/sections/Team.tsx` (Adrienne Omega/Marketing/`/team/adrienne.png`; Carisse Solatorio/Operations; Khristine Arancta/Operations; Marianne Folgurinas/Admin), `imageAlt = name`.
- [ ] **Step 4: Repository (+test)** `getTeam` (cached `cms:team`, fallback) + `getTeamForAdmin()`. Same collection test shape as Task 1.2 Step 4.
- [ ] **Step 5: Validation** name 1–80, role 1–60, image required, bio optional ≤ 500.
- [ ] **Step 6: Actions** create/update/delete/reorder with `ImageField` upload to folder `team`, `revalidateTag("cms:team")`.
- [ ] **Step 7: Admin views** `app/admin/team/*` (list + form with `ImageField`).
- [ ] **Step 8: Public wiring** refactor `components/sections/Team.tsx` to `Team({ members }: { members: TeamMemberItem[] })`, keep markup; pass from `app/page.tsx` and `app/about/page.tsx`.
- [ ] **Step 9:** `npm test` + build green; manual check.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable team members"`

### Task 1.4: Homepage Extras (TrustBadges, WhyChoose, CtaBanner)

**Files:** models `TrustBadge`, `WhyChooseItem`, `CtaBanner`; fallbacks/repository(+test)/validation/actions; `app/admin/homepage/*`; modify `components/sections/TrustBadges.tsx`, `WhyChoose.tsx`, `CtaBanner.tsx`, `app/page.tsx`, `app/about/page.tsx`.

- [ ] **Step 1: Prisma models**
```prisma
model TrustBadge   { id String @id @default(cuid()) iconName String title String description String order Int @default(0) }
model WhyChooseItem{ id String @id @default(cuid()) iconName String title String description String order Int @default(0) }
model CtaBanner    { id String @id @default("singleton") headline String body String buttonLabel String buttonHref String }
```
Run `npm run db:push`.
- [ ] **Step 2: Types** `TrustBadgeItem`, `WhyChooseItemT`, `CtaBannerContent`.
- [ ] **Step 3: Fallbacks** exact values from the three components (TrustBadges: RCIC Licensed/MapleLeaf, 500+ Cases Assisted/Users, 12+ Years Experience/Star, Multilingual Support/MessageCircle — note: the MapleLeaf badge uses a custom SVG, so store `iconName: "MapleLeaf"` and add MapleLeaf to the icon allowlist in Task 0.9 if not already; WhyChoose: Honest Advice/ShieldCheck, Personal Attention/UserRound, Regulated Expertise/ScrollText; CtaBanner: headline "Your Canadian journey starts with a conversation.", body, button "Book Your Free Assessment"/`#book`).
- [ ] **Step 3a:** Update `lib/cms/icons.ts` + its test to include `MapleLeaf` (import from `@/components/ui/MapleLeaf`).
- [ ] **Step 4: Repository(+test)** `getTrustBadges`, `getWhyChoose`, `getCtaBanner` (tag `cms:homepage-extras` for all three; one save revalidates the tag) + admin variants.
- [ ] **Step 5: Validation** title/description limits; icon in allowlist; CTA href url-or-path.
- [ ] **Step 6: Actions** CRUD for badges + why-choose, upsert for CTA; `revalidateTag("cms:homepage-extras")`.
- [ ] **Step 7: Admin views** `app/admin/homepage/page.tsx` with three sub-sections (badges list, why-choose list, CTA form).
- [ ] **Step 8: Public wiring** refactor the three components to props; pass from `app/page.tsx` (and `app/about/page.tsx` for TrustBadges + WhyChoose).
- [ ] **Step 9:** `npm test` + build green; manual check homepage + about identical.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable homepage extras (badges, why-choose, CTA)"`

### ✅ Checkpoint 1 — Homepage

```bash
npm run lint && npm test && npm run build
```
Manual: with all homepage tables empty, `/` and `/about` render **pixel-identical** to pre-CMS (compare against `assets/mvc_revised.png` and a `git stash`-of-nothing baseline). Then edit each module in `/admin` and confirm changes appear on `/` and `/about` within seconds. Confirm no auth is required to view public pages.

**Gate:** all green + manual identical-render confirmed.

---

# PHASE 2 — About, Contact, Testimonials, FAQs

### Task 2.1: About content

**Files:** `AboutContent` model; fallbacks/repository(+test)/validation/actions; `app/admin/about/*`; modify `app/about/page.tsx`.

- [ ] **Step 1: Model**
```prisma
model AboutContent {
  id          String  @id @default("singleton")
  eyebrow     String
  heading     String
  lede        String
  bodyMarkdown String
  imageUrl    String?
  imageAlt    String?
}
```
Run `npm run db:push`.
- [ ] **Step 2: Type** `AboutContent = { eyebrow; heading; lede; bodyMarkdown; imageUrl?; imageAlt? }`.
- [ ] **Step 3: Fallback** from `app/about/page.tsx`: eyebrow "About MVC", heading "A small firm, doing this work the right way.", lede (the PageHero lede), bodyMarkdown = today's body copy from the about page (read the file, copy the prose verbatim into Markdown), imageUrl "/team/yaniv.png".
- [ ] **Step 4: Repository(+test)** `getAbout` (cached `cms:about`, fallback) + admin variant.
- [ ] **Step 5: Validation** heading/lede required; bodyMarkdown ≤ 8000; image optional.
- [ ] **Step 6: Action** `saveAbout` (Pattern C) + `ImageField` (folder `about`) + `revalidateTag("cms:about")`.
- [ ] **Step 7: Admin view** `app/admin/about/*` with a `MarkdownField` (textarea + live preview) for the body.
- [ ] **Step 8: Public wiring** `app/about/page.tsx`: fetch `getAbout()`, feed the PageHero (`eyebrow/heading→title/lede`) and render `bodyMarkdown` via `react-markdown` + `remark-gfm` inside the existing `Prose`/layout (replacing the hardcoded prose block only; keep the Yaniv image card markup, now using `about.imageUrl`/`imageAlt`). Keep the reused sections (TrustBadges/Services/WhyChoose/Team) wired from Phase 1.
- [ ] **Step 9:** `npm test` + build green; manual check `/about` identical then editable.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable About page"`

### Task 2.2: Contact information (+ footer)

**Files:** `ContactInfo` (singleton) + `Office`, `BookingOption`, `SocialLink` models; fallbacks/repository(+test)/validation/actions; `app/admin/contact/*`; modify `app/contact/page.tsx`, `components/site/Footer.tsx`.

- [ ] **Step 1: Models**
```prisma
model ContactInfo {
  id          String  @id @default("singleton")
  phone       String
  email       String
  addressLine String
  offices       Office[]
  bookingOptions BookingOption[]
  socialLinks    SocialLink[]
}
model Office        { id String @id @default(cuid()) label String lines String[] order Int @default(0) contactId String contact ContactInfo @relation(fields: [contactId], references: [id]) }
model BookingOption { id String @id @default(cuid()) title String price String description String href String order Int @default(0) contactId String contact ContactInfo @relation(fields: [contactId], references: [id]) }
model SocialLink    { id String @id @default(cuid()) platform String url String order Int @default(0) contactId String contact ContactInfo @relation(fields: [contactId], references: [id]) }
```
Run `npm run db:push`.
- [ ] **Step 2: Types** `ContactContent` with nested arrays.
- [ ] **Step 3: Fallback** exact values from `app/contact/page.tsx` (`contactDetails`, `bookingOptions`) + `Footer.tsx` (phone `+1 (604) 123-4567` → use the real Burnaby `+1 778 288 7388` per CLAUDE.md note; email `info@myvisaforcanada.com`; social links Facebook/Instagram/LinkedIn/YouTube with `#`). Offices = Canada + Philippines blocks. **Reconcile the placeholder phone here** (CLAUDE.md known gap).
- [ ] **Step 4: Repository(+test)** `getContact` (cached `cms:contact`, fallback) + admin variant.
- [ ] **Step 5: Validation** phone/email/address; offices (label + lines[]); booking (title/price/description/href url); social (platform enum + url).
- [ ] **Step 6: Actions** `saveContact` (upsert singleton + replace children in a transaction) + per-child CRUD as needed; `revalidateTag("cms:contact")`.
- [ ] **Step 7: Admin view** `app/admin/contact/*`: top-level fields + repeatable office/booking/social rows.
- [ ] **Step 8: Public wiring** `app/contact/page.tsx` (map offices→`contactDetails`, booking→cards) and `components/site/Footer.tsx` (phone/email/socials). Footer is in `app/layout.tsx`; fetch `getContact()` in the `Footer` server component. Keep markup identical; the static "Hours/Languages" detail rows can remain as offices entries or dedicated fields — keep as offices/detail rows to match current layout.
- [ ] **Step 9:** `npm test` + build green; manual check `/contact` + footer identical then editable.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable contact info + footer"`

### Task 2.3: Testimonials

**Files:** `Testimonial` model; fallbacks/repository(+test)/validation/actions; `app/admin/testimonials/*`; modify `app/success-stories/page.tsx` (read it first to learn current structure) and surface on homepage only if one exists today (it does not — so testimonials render on Success Stories page).

- [ ] **Step 1: Model**
```prisma
model Testimonial {
  id        String  @id @default(cuid())
  author    String
  location  String?
  quote     String
  rating    Int?
  imageUrl  String?
  order     Int     @default(0)
  published Boolean @default(true)
}
```
Run `npm run db:push`.
- [ ] **Step 2: Type** `TestimonialItem`.
- [ ] **Step 3:** Read `app/success-stories/page.tsx`; copy its existing stories verbatim into `lib/cms/fallbacks/testimonials.ts`.
- [ ] **Step 4: Repository(+test)** `getTestimonials` (cached `cms:testimonials`, fallback) + admin variant.
- [ ] **Step 5: Validation** author 1–80, quote 1–800, rating 1–5 optional, location optional.
- [ ] **Step 6: Actions** CRUD + reorder, `ImageField` folder `testimonials`, `revalidateTag("cms:testimonials")`.
- [ ] **Step 7: Admin view** `app/admin/testimonials/*`.
- [ ] **Step 8: Public wiring** refactor the Success Stories page's testimonial rendering to map over `getTestimonials()`; keep markup identical.
- [ ] **Step 9:** `npm test` + build green; manual check.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable testimonials"`

### Task 2.4: FAQs

**Files:** `Faq` model; fallbacks/repository(+test)/validation/actions; `app/admin/faqs/*`; modify `app/faq/page.tsx`.

- [ ] **Step 1: Model**
```prisma
model Faq {
  id        String  @id @default(cuid())
  category  String
  question  String
  answer    String
  order     Int     @default(0)
  published Boolean @default(true)
}
```
Run `npm run db:push`.
- [ ] **Step 2: Type** `FaqItem`. Keep the existing category list (`general`, `express-entry`, `pnp`, `family`, `work-study`, `process-fees`) as a shared const `FAQ_CATEGORIES` in `lib/cms/faq-categories.ts` (label + key), reused by admin select + public grouping.
- [ ] **Step 3: Fallback** all 18 Q&As from `app/faq/page.tsx` verbatim with their categories + order.
- [ ] **Step 4: Repository(+test)** `getFaqs` (cached `cms:faqs`, fallback) + admin variant.
- [ ] **Step 5: Validation** category in `FAQ_CATEGORIES`, question 1–200, answer 1–2000.
- [ ] **Step 6: Actions** CRUD + reorder, `revalidateTag("cms:faqs")`.
- [ ] **Step 7: Admin view** `app/admin/faqs/*` (grouped by category; `SelectField` for category).
- [ ] **Step 8: Public wiring** `app/faq/page.tsx` groups `getFaqs()` by category using `FAQ_CATEGORIES`; keep `<details>` markup identical.
- [ ] **Step 9:** `npm test` + build green; manual check.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable FAQs"`

### ✅ Checkpoint 2 — Inner pages

```bash
npm run lint && npm test && npm run build
```
Manual: `/about`, `/contact`, `/success-stories`, `/faq`, and the footer render identically with empty tables; each editable via `/admin`. Phone number reconciled.

**Gate:** all green + manual confirmed.

---

# PHASE 3 — Blog

### Task 3.1: Blog model + repository + migration

**Files:** `BlogPost` model; `lib/cms/repositories/blog.ts` (+test); `lib/cms/fallbacks/blog.ts` (empty array fallback — posts are migrated, not hardcoded); `scripts/migrate-blog.ts`.

- [ ] **Step 1: Model**
```prisma
enum PostStatus { DRAFT PUBLISHED }
model BlogPost {
  id            String     @id @default(cuid())
  slug          String     @unique
  title         String
  dek           String
  date          String
  author        String
  readTime      String
  coverImageUrl String?
  status        PostStatus @default(DRAFT)
  bodyMarkdown  String
  seoTitle      String?
  seoDescription String?
  ogImageUrl    String?
  updatedAt     DateTime   @updatedAt
}
```
Run `npm run db:push`.
- [ ] **Step 2: Types** `BlogPostMeta`, `BlogPost` (mirror existing `PostMeta`/`Post` in `lib/blog.ts`).
- [ ] **Step 3: Repository(+test)** `getAllPosts()` (published only, ordered by date desc, cached `cms:blog`), `getPost(slug)` (published only), `getAllPostsForAdmin()`, `getPostByIdForAdmin(id)`. Tests: empty DB → `[]`/`null`; DB throws → `[]`/`null` (never crash); returns mapped rows. **Keep the same return shapes as today's `lib/blog.ts`** so the public pages need minimal change.
- [ ] **Step 4: Migration script** `scripts/migrate-blog.ts` — read every `content/blog/*.md` with `gray-matter`, strip the leading `# Body` heading from the content, and upsert a `BlogPost` (status `PUBLISHED`) keyed by slug. Run it: `tsx scripts/migrate-blog.ts`. Verify in `db:studio` that all 9 posts imported.
- [ ] **Step 5:** `npm test` + build green.
- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: blog model, repository, markdown migration"`

### Task 3.2: Blog admin (Markdown editor + draft/publish) + public wiring

**Files:** `validation/blog.ts`; `actions/blog.ts`; `app/admin/blog/page.tsx`, `app/admin/blog/[id]/page.tsx`, form; modify `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`.

- [ ] **Step 1: Validation** `blog.ts`: slug (lowercase, kebab, unique-checked in action), title/dek/date/author/readTime required, bodyMarkdown ≤ 50000, status enum, optional SEO + cover.
- [ ] **Step 2: Actions** `createPost`, `updatePost(id)`, `deletePost(id)`, `setPostStatus(id, status)`: `requireUser()`, sanitize, unique-slug check (friendly error), `ImageField` folder `blog` for cover + `seo`/`ogImageUrl`, `revalidateTag("cms:blog")` + `revalidatePath("/blog")` + `revalidatePath(`/blog/${slug}`)`.
- [ ] **Step 3: Admin views** list (title, status badge, edit/delete, "New post") + editor with `MarkdownField` (textarea + live `react-markdown` preview) and a Draft/Published toggle.
- [ ] **Step 4: Public wiring** point `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` at the new repository (`getAllPosts`/`getPost`) instead of `lib/blog.ts`. Keep `generateStaticParams` (now from DB) and the existing render markup. Keep `lib/blog.ts` + `content/blog/*.md` in place as backup (do not delete yet).
- [ ] **Step 5:** `npm test` + build green; manual: `/blog` + a post render identically (from DB); create a DRAFT post → not visible publicly; publish → visible within seconds.
- [ ] **Step 6: Commit** `git commit -am "feat: blog admin with markdown editor and draft/publish"`

### ✅ Checkpoint 3 — Blog

```bash
npm run lint && npm test && npm run build
```
Manual: all 9 migrated posts render identically at their existing URLs; draft/publish works; new posts publishable.

**Gate:** all green + manual confirmed.

---

# PHASE 4 — SEO metadata

### Task 4.1: SEO model + per-page metadata wiring

**Files:** `SeoMeta` model; `lib/cms/fallbacks/seo.ts`; `repositories/seo.ts` (+test); `validation/seo.ts`; `actions/seo.ts`; `app/admin/seo/*`; modify `app/layout.tsx` + each page's `generateMetadata`.

- [ ] **Step 1: Model**
```prisma
model SeoMeta {
  id          String  @id @default(cuid())
  pageKey     String  @unique  // "home","about","contact","faq","why-canada","success-stories","get-started","blog","__default__"
  title       String
  description String
  ogImageUrl  String?
}
```
Run `npm run db:push`.
- [ ] **Step 2: Type** `SeoMetaContent`.
- [ ] **Step 3: Fallback** `lib/cms/fallbacks/seo.ts` — a `__default__` (from `app/layout.tsx` metadata) + one entry per page using each page's current `metadata` export values verbatim.
- [ ] **Step 4: Repository(+test)** `getSeo(pageKey)` → cached `cms:seo`, returns the page's row, else the `__default__` row, else the hardcoded fallback (never throws). `getAllSeoForAdmin()`.
- [ ] **Step 5: Validation** title ≤ 70, description ≤ 200, ogImage optional.
- [ ] **Step 6: Actions** `saveSeo(pageKey)` upsert + `ImageField` folder `seo` + `revalidateTag("cms:seo")` + `revalidatePath` of the affected page.
- [ ] **Step 7: Admin view** `app/admin/seo/*` — one form per pageKey + the default; OG image upload.
- [ ] **Step 8: Public wiring** add/replace `generateMetadata` in each page (`app/page.tsx`, `about`, `contact`, `faq`, `why-canada`, `success-stories`, `get-started`, `blog`) to read `getSeo(pageKey)` and return `{ title, description, openGraph: { images: [ogImageUrl] }, twitter: {...} }`. For blog posts, `app/blog/[slug]/page.tsx` `generateMetadata` uses the post's own `seoTitle/seoDescription/ogImageUrl` (fallback to title/dek/cover). Keep the root layout `metadata` template (`%s · MVC Immigration`) and set `default`/`description` from `getSeo("__default__")`.
- [ ] **Step 9:** `npm test` + build green; manual: view-source `<title>`/`<meta description>`/`og:image` reflect DB values and fall back when empty.
- [ ] **Step 10: Commit** `git commit -am "feat: CMS-editable SEO metadata + social image"`

### ✅ Checkpoint 4 — SEO

```bash
npm run lint && npm test && npm run build
```
Manual: each page's title/description/OG image are editable and fall back correctly.

**Gate:** all green + manual confirmed.

---

# PHASE 5 — Seed, docs, deploy secrets, final verification

### Task 5.1: Unified seed script

**Files:** `scripts/seed-cms.ts`.

- [ ] **Step 1:** Write an idempotent seed that upserts every singleton + collection from the `lib/cms/fallbacks/*` constants (reusing them as the seed source) and invokes the blog migration (Task 3.1 Step 4). This lets a fresh DB be populated with launch content in one command.
- [ ] **Step 2:** Run `npm run db:seed` against a fresh dev DB; verify in `db:studio` that every table has the expected rows.
- [ ] **Step 3: Commit** `git add scripts && git commit -m "feat: unified CMS seed script"`

### Task 5.2: Client guide + setup docs

**Files:** `docs/cms/CLIENT-GUIDE.md`, `docs/cms/SETUP.md`; update `CLAUDE.md` (CMS section) and `README.md` (CMS quickstart).

- [ ] **Step 1: `docs/cms/SETUP.md`** — exact steps: create Neon DB → copy `DATABASE_URL`; create Vercel Blob store → copy `BLOB_READ_WRITE_TOKEN`; generate `AUTH_SECRET` (`openssl rand -base64 32`); set all three in `.env` (local) and in Vercel Project → Settings → Environment Variables (production); run `prisma migrate deploy` on deploy; create the first admin (`npm run admin:create -- ...`); seed (`npm run db:seed`).
- [ ] **Step 2: `docs/cms/CLIENT-GUIDE.md`** — how to log in at `/admin/login`; a section per module (what each field does, image size guidance, the icon dropdown, guarantees-per-line, draft vs publish for blog, SEO fields incl. social image) and "changes appear within seconds." Plain language for a non-technical client.
- [ ] **Step 3:** Add a "## CMS / Admin" section to `CLAUDE.md` describing the new architecture (Models/Controllers/Views layout, fallbacks, revalidation) and a CMS quickstart to `README.md`.
- [ ] **Step 4: Commit** `git add docs CLAUDE.md README.md && git commit -m "docs: CMS setup and client editing guide"`

### Task 5.3: Production secrets + deploy checklist (verification only)

**Files:** none (verification + `docs/cms/SETUP.md` already covers it).

- [ ] **Step 1:** Confirm `.env` is gitignored and no secret is committed (`git log -p | grep -i secret` sanity scan; `git ls-files | grep -E '^\.env$'` returns nothing).
- [ ] **Step 2:** Confirm Vercel build uses `prisma generate` (add `"postinstall": "prisma generate"` to `package.json` scripts so Vercel generates the client) and `prisma migrate deploy` runs (document as the Vercel build/deploy step or a `vercel-build` script). Switch `db:push` usage to a real migration before launch: `npm run db:migrate -- --name init` to create `prisma/migrations`, commit them.
- [ ] **Step 3:** Document the production checklist in `SETUP.md`: env vars set in Vercel; migrations committed + `migrate deploy`; first admin created (run `admin:create` against prod DB or via a one-off); seed run once; verify `/admin` login over HTTPS sets a `secure` cookie.
- [ ] **Step 4: Commit** `git add package.json prisma docs && git commit -m "chore: production migrations + deploy checklist"`

### ✅ Checkpoint 5 — Final verification

```bash
npm run lint && npm test && npm run build
```
Then, against a **fresh empty DB** (no seed):
- Every public page renders today's content via fallbacks; nothing crashes.
Then run `npm run db:seed` and:
- Every page still renders identically (now from DB).
- Log into `/admin`, edit one field in each of the 9 modules + homepage extras, upload one image, publish a blog post → all reflected on the public site within seconds.
- Confirm public routes require no auth; `/admin/*` (except login) redirects to login when logged out.
- Confirm `git ls-files` contains no `.env` and no secrets.

**Gate:** all green + full manual checklist confirmed → feature complete.

---

## Spec coverage map (self-review)

| Spec requirement | Task(s) |
|---|---|
| MVC layering (Models/Controllers/Views) | Patterns A–E; all module tasks |
| Hosting = Vercel | Task 5.3 (migrations, postinstall, blob hostname) |
| Prisma + Neon | 0.2, every model task |
| Vercel Blob images, optimized + organized | 0.10, used in 1.1/1.3/2.3/3.2/4.1 |
| Custom JWT-cookie auth, one role | 0.3, 0.4, 0.5, 0.7; 0.6 (users) |
| Auth only on admin, none on public | 0.5 (matcher), Checkpoints 1 & 5 |
| Login rate-limiting (DB-backed lockout) | 0.2 (fields), 0.7 (lockout logic) |
| Origin checks on mutations | Next 14 Server Actions enforce Origin/Host by default |
| Markdown long-form, plain short fields | 2.1 (about), 3.2 (blog), `MarkdownField` |
| Instant publish via revalidation | every action; `revalidateTag` per tag |
| Draft/Published for blog | 3.1 (enum), 3.2 (toggle) |
| Fallback content (empty + DB-down) | Pattern A, every repository test, Checkpoints |
| Zod validation all fields | 0.7 + every `validation/*` |
| Sanitize input; markdown XSS-safe | 0.11, every action; no `rehype-raw` |
| Image upload for hero/services/team/testimonials/blog | 1.1, 1.3, 2.3, 3.2 (+ about/seo) |
| SEO title/description/social image | Phase 4 |
| 9 modules + homepage extras | Phases 1–4 |
| Pathways out of scope | untouched (no task) |
| Client + setup docs | 5.2 |
| Production deployment secrets | 5.3, 5.2 |
| Public design unchanged | Pattern E + identical-render gates at every checkpoint |

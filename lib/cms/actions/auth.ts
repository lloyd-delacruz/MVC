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
  const parsed = loginSchema.safeParse({
    email: fd.get("email"),
    password: fd.get("password"),
  });
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
          lockedUntil:
            attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
        },
      });
    }
    return { error: "Invalid email or password." }; // generic message — no user enumeration
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });
  await createSession({ sub: user.id, email: user.email });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

import { SignJWT, jwtVerify } from "jose";

// Edge-safe JWT helpers: NO next/headers or next/navigation imports here, so
// this module is safe to use from middleware (Edge runtime).

export const SESSION_COOKIE = "mvc_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const ALG = "HS256";

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
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
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

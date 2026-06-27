import 'server-only';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'nyfs_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set and at least 32 characters long.');
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string; // user id
  email: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/** Write the session cookie on the outgoing response. Call from a Route Handler. */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Read and verify the current session from the incoming request cookies. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

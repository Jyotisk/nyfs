import 'server-only';
import { getSession } from '@/lib/auth';

export type AdminCheck =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; error: string };

function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? '';
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function verifyAdmin(): Promise<AdminCheck> {
  const session = await getSession();
  if (!session) return { ok: false, status: 401, error: 'Invalid session' };

  const email = session.email.toLowerCase();
  if (!getAdminEmails().has(email)) {
    return { ok: false, status: 403, error: 'Not authorized' };
  }
  return { ok: true, email };
}

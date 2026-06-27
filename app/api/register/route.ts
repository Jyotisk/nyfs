import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 500): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

// Public registration form. Writes ONLY to the registrations table.
// No user account or session is created.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 254) : '';

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  try {
    await prisma.registration.create({
      data: {
        email,
        fullName: str(b.full_name, 200),
        whatsapp: str(b.whatsapp, 30),
        institution: str(b.institution, 200),
        grade: str(b.grade, 50),
        city: str(b.city, 100),
        motivation: str(b.motivation, 5000),
        problem: str(b.problem, 5000),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = err.meta?.target;
      const fields = Array.isArray(target) ? target.join(',') : String(target ?? '');
      const message = fields.includes('whatsapp')
        ? 'This WhatsApp number is already registered.'
        : 'This email is already registered.';
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Could not save your registration. Please try again.' }, { status: 500 });
  }
}

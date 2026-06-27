import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 500): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 254) : '';
  const password = typeof b.password === 'string' ? b.password : '';

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        fullName: str(b.full_name, 200),
        whatsapp: str(b.whatsapp, 30),
        institution: str(b.institution, 200),
        grade: str(b.grade, 50),
        city: str(b.city, 100),
        motivation: str(b.motivation, 5000),
        problem: str(b.problem, 5000),
        paymentId: str(b.payment_id, 100),
        orderId: str(b.order_id, 100),
      },
    });

    await setSessionCookie({ sub: user.id, email: user.email });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
    }
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed. Please contact support.' }, { status: 500 });
  }
}

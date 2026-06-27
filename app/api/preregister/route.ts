import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Basic email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // --- Input validation ---
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);

    await prisma.preregistration.create({ data: { email: sanitizedEmail } });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    // Unique violation — already registered
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
    }
    console.error('Preregister DB error:', err);
    return NextResponse.json({ error: 'Could not save your registration. Please try again.' }, { status: 500 });
  }
}

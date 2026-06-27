import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export type SignupRow = {
  id: string;
  full_name: string | null;
  email: string;
  whatsapp: string | null;
  institution: string | null;
  grade: string | null;
  city: string | null;
  motivation: string | null;
  problem: string | null;
  created_at: string;
};

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      whatsapp: true,
      institution: true,
      grade: true,
      city: true,
      motivation: true,
      problem: true,
      createdAt: true,
    },
  });

  const rows: SignupRow[] = registrations.map((r) => ({
    id: r.id.toString(),
    full_name: r.fullName,
    email: r.email,
    whatsapp: r.whatsapp,
    institution: r.institution,
    grade: r.grade,
    city: r.city,
    motivation: r.motivation,
    problem: r.problem,
    created_at: r.createdAt.toISOString(),
  }));

  return Response.json({ rows });
}

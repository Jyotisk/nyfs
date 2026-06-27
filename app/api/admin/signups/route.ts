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

  const users = await prisma.user.findMany({
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

  const rows: SignupRow[] = users.map((u) => ({
    id: u.id,
    full_name: u.fullName,
    email: u.email,
    whatsapp: u.whatsapp,
    institution: u.institution,
    grade: u.grade,
    city: u.city,
    motivation: u.motivation,
    problem: u.problem,
    created_at: u.createdAt.toISOString(),
  }));

  return Response.json({ rows });
}

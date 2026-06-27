import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export type RecentSignup = {
  id: string;
  full_name: string | null;
  email: string;
  city: string | null;
  created_at: string;
};

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, last7Days, cities, institutions, announcements, recent] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.registration.findMany({
      where: { city: { not: null } },
      distinct: ['city'],
      select: { city: true },
    }),
    prisma.registration.findMany({
      where: { institution: { not: null } },
      distinct: ['institution'],
      select: { institution: true },
    }),
    prisma.announcement.count(),
    prisma.registration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, fullName: true, email: true, city: true, createdAt: true },
    }),
  ]);

  return Response.json({
    totalStudents: total,
    last7Days,
    uniqueCities: cities.length,
    uniqueInstitutions: institutions.length,
    totalAnnouncements: announcements,
    recent: recent.map((r) => ({
      id: r.id.toString(),
      full_name: r.fullName,
      email: r.email,
      city: r.city,
      created_at: r.createdAt.toISOString(),
    })) satisfies RecentSignup[],
  });
}

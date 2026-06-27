import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Announcements are readable by any signed-in participant.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  const rows = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, title: true, content: true, type: true, createdAt: true },
  });

  return NextResponse.json({
    rows: rows.map((r) => ({
      id: r.id.toString(),
      title: r.title,
      content: r.content,
      type: r.type,
      created_at: r.createdAt.toISOString(),
    })),
  });
}

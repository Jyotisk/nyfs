import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/adminAuth';
import { AnnouncementType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  created_at: string;
};

const VALID_TYPES: AnnouncementType[] = ['URGENT', 'UPDATE', 'EVENT'];
const TITLE_MAX = 200;
const CONTENT_MAX = 5000;
const ID_RE = /^\d+$/;

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const rows = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, content: true, type: true, createdAt: true },
  });

  return Response.json({
    rows: rows.map((r) => ({
      id: r.id.toString(),
      title: r.title,
      content: r.content,
      type: r.type,
      created_at: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as { title?: unknown; content?: unknown; type?: unknown };
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const content = typeof b.content === 'string' ? b.content.trim() : '';
  const typeRaw = typeof b.type === 'string' ? b.type.trim().toUpperCase() : 'UPDATE';

  if (!title || !content) {
    return Response.json({ error: 'Title and content are required' }, { status: 400 });
  }
  if (title.length > TITLE_MAX) {
    return Response.json({ error: `Title must be ${TITLE_MAX} characters or fewer` }, { status: 400 });
  }
  if (content.length > CONTENT_MAX) {
    return Response.json({ error: `Content must be ${CONTENT_MAX} characters or fewer` }, { status: 400 });
  }
  if (!VALID_TYPES.includes(typeRaw as AnnouncementType)) {
    return Response.json({ error: 'Invalid type' }, { status: 400 });
  }

  const row = await prisma.announcement.create({
    data: { title, content, type: typeRaw as AnnouncementType },
    select: { id: true, title: true, content: true, type: true, createdAt: true },
  });

  return Response.json(
    {
      row: {
        id: row.id.toString(),
        title: row.title,
        content: row.content,
        type: row.type,
        created_at: row.createdAt.toISOString(),
      },
    },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const id = new URL(request.url).searchParams.get('id');
  if (!id || !ID_RE.test(id)) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    await prisma.announcement.delete({ where: { id: BigInt(id) } });
  } catch {
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
  return Response.json({ ok: true });
}

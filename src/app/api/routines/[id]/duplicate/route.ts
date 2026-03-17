import { NextResponse } from 'next/server';

import { duplicateRoutine } from '@/data/routines';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const duplicated = await duplicateRoutine(id);

  if (!duplicated) {
    return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
  }

  return NextResponse.json({ id: duplicated.id });
}

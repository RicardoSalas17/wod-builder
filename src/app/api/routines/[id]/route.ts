import { NextResponse } from 'next/server';

import { updateRoutine } from '@/data/routines';
import { parseRoutinePayload } from '../payload';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json().catch(() => null);
  const payload = parseRoutinePayload(body);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id } = await params;
  const updated = await updateRoutine(id, payload);

  if (!updated) {
    return NextResponse.json({ error: 'Routine not found' }, { status: 404 });
  }

  return NextResponse.json({ id: updated.id });
}

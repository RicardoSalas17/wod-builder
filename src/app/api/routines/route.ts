import { NextResponse } from 'next/server';

import { createRoutine } from '@/data/routines';
import { parseRoutinePayload } from './payload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const payload = parseRoutinePayload(body);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const created = await createRoutine(payload);

  return NextResponse.json({ id: created.id });
}

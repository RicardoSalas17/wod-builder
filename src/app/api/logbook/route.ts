import { NextResponse } from 'next/server';

import { createLogSession } from '@/data/logbook';
import { parseLogbookPayload } from './payload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const payload = parseLogbookPayload(body);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const created = await createLogSession(payload);

  return NextResponse.json({ id: created.id });
}

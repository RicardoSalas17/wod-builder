import { getExerciseHistory } from '@/data/logbook';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name')?.trim() ?? '';
  const limitRaw = parseInt(searchParams.get('limit') ?? '5', 10);
  const limit = Number.isNaN(limitRaw) || limitRaw < 1 ? 5 : Math.min(limitRaw, 20);

  if (!name) {
    return NextResponse.json({ history: [] });
  }

  const history = await getExerciseHistory(name, limit);
  return NextResponse.json({ history });
}

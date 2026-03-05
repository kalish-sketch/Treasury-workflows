import { NextResponse } from 'next/server';
import { runSeed } from '@/lib/seed';

/**
 * POST /api/seed
 * Seeds the database with workflow & agent data.
 * Call /api/setup first to create the tables.
 * Remove this route once your DB is seeded.
 */
export async function POST() {
  const url = process.env.STORAGE_URL;
  if (!url) {
    return NextResponse.json({ error: 'STORAGE_URL not configured' }, { status: 500 });
  }

  try {
    const counts = await runSeed(url);
    return NextResponse.json({ success: true, inserted: counts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { workflows } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// PATCH /api/workflows/visibility — bulk update workflow visibility
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const updates: Array<{ key: string; visible: boolean }> = body.updates;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'updates array is required' }, { status: 400 });
    }

    const db = getDb();

    for (const u of updates) {
      await db
        .update(workflows)
        .set({ visible: u.visible })
        .where(eq(workflows.key, u.key));
    }

    return NextResponse.json({ updated: updates.length });
  } catch (err) {
    console.error('Visibility update failed:', err);
    return NextResponse.json({ error: 'Failed to update visibility' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { assessments } from '@/lib/schema';
import { desc, eq, sql } from 'drizzle-orm';

// GET /api/assessments - list all assessments
// GET /api/assessments?id=<uuid> - get a single assessment
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (id) {
      const [assessment] = await getDb()
        .select()
        .from(assessments)
        .where(eq(assessments.id, id))
        .limit(1);

      if (!assessment) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }
      return NextResponse.json(assessment);
    }

    const all = await getDb()
      .select({
        id: assessments.id,
        companyName: assessments.companyName,
        createdAt: assessments.createdAt,
        updatedAt: assessments.updatedAt,
      })
      .from(assessments)
      .orderBy(desc(assessments.updatedAt));

    return NextResponse.json(all);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('GET /api/assessments error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/assessments - create or update (upsert by companyName)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const companyName = (body.companyName || '').trim();

    // Check for existing assessment with same company name (case-insensitive)
    const existing = companyName
      ? await getDb()
          .select({ id: assessments.id })
          .from(assessments)
          .where(sql`lower(${assessments.companyName}) = lower(${companyName})`)
          .limit(1)
      : [];

    if (existing.length > 0) {
      // Update existing assessment
      const [updated] = await getDb()
        .update(assessments)
        .set({
          companyName,
          profile: body.profile || {},
          workflowSelections: body.workflowSelections || {},
          customWorkflows: body.customWorkflows || {},
          updatedAt: new Date(),
        })
        .where(eq(assessments.id, existing[0].id))
        .returning();

      return NextResponse.json(updated);
    }

    // Create new assessment
    const [created] = await getDb()
      .insert(assessments)
      .values({
        companyName,
        profile: body.profile || {},
        workflowSelections: body.workflowSelections || {},
        customWorkflows: body.customWorkflows || {},
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('POST /api/assessments error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/assessments - update an existing assessment
export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const [updated] = await getDb()
    .update(assessments)
    .set({
      companyName: body.companyName,
      profile: body.profile,
      workflowSelections: body.workflowSelections,
      customWorkflows: body.customWorkflows,
      updatedAt: new Date(),
    })
    .where(eq(assessments.id, body.id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/assessments?id=<uuid> - delete an assessment
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const [deleted] = await getDb()
    .delete(assessments)
    .where(eq(assessments.id, id))
    .returning({ id: assessments.id });

  if (!deleted) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { assessments } from '@/lib/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

// GET /api/assessments - list all assessments
// GET /api/assessments?id=<uuid> - get a single assessment
// GET /api/assessments?mine=true - list assessments for current user
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const mine = request.nextUrl.searchParams.get('mine');

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

    if (mine === 'true') {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      }
      const userAssessments = await getDb()
        .select({
          id: assessments.id,
          companyName: assessments.companyName,
          createdAt: assessments.createdAt,
          updatedAt: assessments.updatedAt,
        })
        .from(assessments)
        .where(eq(assessments.userId, session.userId))
        .orderBy(desc(assessments.updatedAt));

      return NextResponse.json(userAssessments);
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

// POST /api/assessments - create or update (upsert by companyName, scoped to user)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const companyName = (body.companyName || '').trim();

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const session = await getSession();
    const userId = session?.userId || null;

    // Check for existing assessment with same company name (case-insensitive), scoped to user
    const existing = await getDb()
      .select({ id: assessments.id })
      .from(assessments)
      .where(
        userId
          ? sql`lower(${assessments.companyName}) = lower(${companyName}) AND ${assessments.userId} = ${userId}`
          : sql`lower(${assessments.companyName}) = lower(${companyName}) AND ${assessments.userId} IS NULL`
      )
      .limit(1);

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
        userId,
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

  const session = await getSession();
  const userId = session?.userId || null;

  // If authenticated, verify ownership
  if (userId) {
    const [existing] = await getDb()
      .select({ userId: assessments.userId })
      .from(assessments)
      .where(eq(assessments.id, body.id))
      .limit(1);

    if (existing && existing.userId && existing.userId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
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

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { assessments } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';

// GET /api/assessments - list all assessments
// GET /api/assessments?id=<uuid> - get a single assessment
export async function GET(request: NextRequest) {
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
}

// POST /api/assessments - create a new assessment
export async function POST(request: NextRequest) {
  const body = await request.json();

  const [created] = await getDb()
    .insert(assessments)
    .values({
      companyName: body.companyName || '',
      profile: body.profile || {},
      workflowSelections: body.workflowSelections || {},
      customWorkflows: body.customWorkflows || {},
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
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

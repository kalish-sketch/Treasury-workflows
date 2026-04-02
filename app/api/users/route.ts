import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, assessments } from '@/lib/schema';
import { desc, eq, sql } from 'drizzle-orm';

// GET /api/users - list all users with their assessment counts and companies
export async function GET() {
  try {
    const allUsers = await getDb()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .orderBy(desc(users.emailVerified));

    // Get assessment counts and company names per user
    const userAssessments = await getDb()
      .select({
        userId: assessments.userId,
        companyName: assessments.companyName,
        updatedAt: assessments.updatedAt,
      })
      .from(assessments)
      .where(sql`${assessments.userId} IS NOT NULL`);

    // Build a map of userId -> { companies, assessmentCount }
    const userMap = new Map<string, { companies: string[]; assessmentCount: number; lastActivity: string }>();
    for (const a of userAssessments) {
      if (!a.userId) continue;
      const entry = userMap.get(a.userId) || { companies: [], assessmentCount: 0, lastActivity: '' };
      entry.assessmentCount++;
      if (a.companyName && !entry.companies.includes(a.companyName)) {
        entry.companies.push(a.companyName);
      }
      const updatedStr = a.updatedAt.toISOString();
      if (!entry.lastActivity || updatedStr > entry.lastActivity) {
        entry.lastActivity = updatedStr;
      }
      userMap.set(a.userId, entry);
    }

    const result = allUsers.map(u => ({
      ...u,
      companies: userMap.get(u.id)?.companies || [],
      assessmentCount: userMap.get(u.id)?.assessmentCount || 0,
      lastActivity: userMap.get(u.id)?.lastActivity || null,
    }));

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('GET /api/users error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

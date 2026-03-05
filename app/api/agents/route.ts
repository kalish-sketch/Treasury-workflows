export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { agents, agentWorkflows, workflows } from '@/lib/schema';
import { asc, eq } from 'drizzle-orm';

// GET /api/agents — returns all agents with their linked workflow keys
export async function GET() {
  const db = getDb();

  const agentList = await db
    .select()
    .from(agents)
    .orderBy(asc(agents.sortOrder));

  const result = await Promise.all(
    agentList.map(async (a) => {
      const links = await db
        .select({ workflowKey: workflows.key })
        .from(agentWorkflows)
        .innerJoin(workflows, eq(agentWorkflows.workflowId, workflows.id))
        .where(eq(agentWorkflows.agentId, a.id));

      return {
        name: a.name,
        desc: a.description,
        impact: a.impact,
        workflows: links.map((l) => l.workflowKey),
      };
    })
  );

  return NextResponse.json(result);
}

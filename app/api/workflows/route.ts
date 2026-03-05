export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cadences, workflows, subWorkflows } from '@/lib/schema';
import { asc, eq } from 'drizzle-orm';

// GET /api/workflows — returns all workflows grouped by cadence
export async function GET() {
  const db = getDb();

  const cadenceList = await db
    .select()
    .from(cadences)
    .orderBy(asc(cadences.sortOrder));

  const result: Record<string, {
    label: string;
    tagline: string;
    color: string;
    workflows: Array<{
      id: string;
      key: string;
      name: string;
      timeEst: string;
      who: string;
      systems: string;
      how: string;
      pain: string;
      hrs: string;
      err: string;
      opt: string;
      subs: Array<{ id: string; key: string; name: string; how: string; pain: string }>;
    }>;
  }> = {};

  for (const c of cadenceList) {
    const wfList = await db
      .select()
      .from(workflows)
      .where(eq(workflows.cadenceId, c.id))
      .orderBy(asc(workflows.sortOrder));

    const wfWithSubs = await Promise.all(
      wfList.map(async (wf) => {
        const subs = await db
          .select()
          .from(subWorkflows)
          .where(eq(subWorkflows.workflowId, wf.id))
          .orderBy(asc(subWorkflows.sortOrder));

        return {
          id: wf.key,
          key: wf.key,
          name: wf.name,
          timeEst: wf.timeEst,
          who: wf.who,
          systems: wf.systems,
          how: wf.how,
          pain: wf.pain,
          hrs: wf.hrs,
          err: wf.err,
          opt: wf.opt,
          subs: subs.map((s) => ({
            id: s.key,
            key: s.key,
            name: s.name,
            how: s.how,
            pain: s.pain,
          })),
        };
      })
    );

    result[c.key] = {
      label: c.label,
      tagline: c.tagline,
      color: c.color,
      workflows: wfWithSubs,
    };
  }

  return NextResponse.json(result);
}

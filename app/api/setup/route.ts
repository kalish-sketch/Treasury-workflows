import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

/**
 * POST /api/setup
 * Creates all database tables. Safe to call multiple times (uses IF NOT EXISTS).
 * Remove this route once your DB is set up.
 */
export async function POST() {
  const url = process.env.STORAGE_URL;
  if (!url) {
    return NextResponse.json({ error: 'STORAGE_URL not configured' }, { status: 500 });
  }

  const sql = neon(url);

  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE IF NOT EXISTS cadences (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      tagline TEXT NOT NULL,
      color TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workflows (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      cadence_id UUID NOT NULL REFERENCES cadences(id),
      name TEXT NOT NULL,
      time_est TEXT NOT NULL DEFAULT '',
      who TEXT NOT NULL DEFAULT '',
      systems TEXT NOT NULL DEFAULT '',
      how TEXT NOT NULL DEFAULT '',
      pain TEXT NOT NULL DEFAULT '',
      hrs TEXT NOT NULL DEFAULT '',
      err TEXT NOT NULL DEFAULT '',
      opt TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sub_workflows (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      workflow_id UUID NOT NULL REFERENCES workflows(id),
      name TEXT NOT NULL,
      how TEXT NOT NULL DEFAULT '',
      pain TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS agents (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      impact TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS agent_workflows (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      agent_id UUID NOT NULL REFERENCES agents(id),
      workflow_id UUID NOT NULL REFERENCES workflows(id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS assessments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      company_name TEXT NOT NULL DEFAULT '',
      profile JSONB NOT NULL DEFAULT '{}',
      workflow_selections JSONB NOT NULL DEFAULT '{}',
      custom_workflows JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  return NextResponse.json({ success: true, message: 'All tables created' });
}

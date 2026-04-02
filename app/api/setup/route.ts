import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

/**
 * POST /api/setup
 * Creates all database tables. Safe to call multiple times (uses IF NOT EXISTS).
 * Remove this route once your DB is set up.
 */
export async function POST() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
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

  // ── Auth.js tables ──

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      email_verified TIMESTAMP,
      image TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      PRIMARY KEY (provider, provider_account_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      session_token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL,
      expires TIMESTAMP NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `;

  // Add user_id to assessments (idempotent)
  await sql`
    ALTER TABLE assessments ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE SET NULL
  `;

  return NextResponse.json({ success: true, message: 'All tables created' });
}

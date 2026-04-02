import { pgTable, text, timestamp, jsonb, uuid, integer, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

// ── Auth.js tables ──

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => [
  primaryKey({ columns: [vt.identifier, vt.token] }),
]);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  assessments: many(assessments),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// ── Cadences (daily, weekly, monthly, quarterly, annual) ──

export const cadences = pgTable('cadences', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),         // e.g. "daily"
  label: text('label').notNull(),              // e.g. "Daily"
  tagline: text('tagline').notNull(),
  color: text('color').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const cadencesRelations = relations(cadences, ({ many }) => ({
  workflows: many(workflows),
}));

// ── Workflows ──

export const workflows = pgTable('workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),         // e.g. "d1", "w2"
  cadenceId: uuid('cadence_id').notNull().references(() => cadences.id),
  name: text('name').notNull(),
  timeEst: text('time_est').notNull().default(''),
  who: text('who').notNull().default(''),
  systems: text('systems').notNull().default(''),
  how: text('how').notNull().default(''),
  pain: text('pain').notNull().default(''),
  hrs: text('hrs').notNull().default(''),
  err: text('err').notNull().default(''),
  opt: text('opt').notNull().default(''),
  category: text('category').notNull().default('Uncategorized'),
  visible: boolean('visible').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  cadence: one(cadences, { fields: [workflows.cadenceId], references: [cadences.id] }),
  subWorkflows: many(subWorkflows),
  agentWorkflows: many(agentWorkflows),
}));

// ── Sub-workflows ──

export const subWorkflows = pgTable('sub_workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),         // e.g. "d1s1"
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id),
  name: text('name').notNull(),
  how: text('how').notNull().default(''),
  pain: text('pain').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const subWorkflowsRelations = relations(subWorkflows, ({ one }) => ({
  workflow: one(workflows, { fields: [subWorkflows.workflowId], references: [workflows.id] }),
}));

// ── Agents ──

export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  impact: text('impact').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const agentsRelations = relations(agents, ({ many }) => ({
  agentWorkflows: many(agentWorkflows),
}));

// ── Agent ↔ Workflow (many-to-many) ──

export const agentWorkflows = pgTable('agent_workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentId: uuid('agent_id').notNull().references(() => agents.id),
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id),
});

export const agentWorkflowsRelations = relations(agentWorkflows, ({ one }) => ({
  agent: one(agents, { fields: [agentWorkflows.agentId], references: [agents.id] }),
  workflow: one(workflows, { fields: [agentWorkflows.workflowId], references: [workflows.id] }),
}));

// ── Assessments (user-created) ──

export const assessments = pgTable('assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  companyName: text('company_name').notNull().default(''),
  profile: jsonb('profile').notNull().default('{}'),
  workflowSelections: jsonb('workflow_selections').notNull().default('{}'),
  customWorkflows: jsonb('custom_workflows').notNull().default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  user: one(users, { fields: [assessments.userId], references: [users.id] }),
}));

// ── Types ──

export type Cadence = typeof cadences.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type SubWorkflow = typeof subWorkflows.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type User = typeof users.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;

import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const assessments = pgTable('assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: text('company_name').notNull().default(''),
  profile: jsonb('profile').notNull().default('{}'),
  workflowSelections: jsonb('workflow_selections').notNull().default('{}'),
  customWorkflows: jsonb('custom_workflows').notNull().default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;

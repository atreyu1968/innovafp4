import { mysqlTable, varchar, timestamp, json, boolean } from 'drizzle-orm/mysql-core';
import { ObservationEntry, ObservatoryConfig } from '../types/observatory';

// ... existing tables ...

export const observatoryEntries = mysqlTable('observatory_entries', {
  id: varchar('id', { length: 36 }).primaryKey(),
  subnetId: varchar('subnet_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  aiContent: varchar('ai_content', { length: 5000 }),
  aiSummary: varchar('ai_summary', { length: 500 }),
  aiTags: json('ai_tags').$type<string[]>(),
  createdBy: varchar('created_by', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  publishedAt: timestamp('published_at'),
  reviewedBy: varchar('reviewed_by', { length: 36 }),
  reviewNotes: varchar('review_notes', { length: 500 }),
});

export const observatoryConfig = mysqlTable('observatory_config', {
  id: varchar('id', { length: 36 }).primaryKey(),
  enabled: boolean('enabled').notNull().default(false),
  aiEnabled: boolean('ai_enabled').notNull().default(false),
  autoPublish: boolean('auto_publish').notNull().default(false),
  moderators: json('moderators').$type<string[]>().notNull(),
  openaiApiKey: varchar('openai_api_key', { length: 100 }),
  promptTemplate: varchar('prompt_template', { length: 1000 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
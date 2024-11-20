import { db } from '../../db';
import { reports } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { Report } from '../../types/report';

export const reportService = {
  async getAll() {
    return await db.select().from(reports);
  },

  async getById(id: string) {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id));
    return report;
  },

  async create(report: Omit<Report, 'id'>) {
    const [newReport] = await db
      .insert(reports)
      .values({
        id: crypto.randomUUID(),
        ...report,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newReport;
  },

  async update(id: string, updates: Partial<Report>) {
    const [updated] = await db
      .update(reports)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(reports).where(eq(reports.id, id));
  },
};
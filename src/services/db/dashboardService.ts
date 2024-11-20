import { db } from '../../db';
import { dashboards } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { Dashboard } from '../../types/dashboard';

export const dashboardService = {
  async getAll() {
    return await db.select().from(dashboards);
  },

  async getById(id: string) {
    const [dashboard] = await db
      .select()
      .from(dashboards)
      .where(eq(dashboards.id, id));
    return dashboard;
  },

  async create(dashboard: Omit<Dashboard, 'id'>) {
    const [newDashboard] = await db
      .insert(dashboards)
      .values({
        id: crypto.randomUUID(),
        ...dashboard,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newDashboard;
  },

  async update(id: string, updates: Partial<Dashboard>) {
    const [updated] = await db
      .update(dashboards)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(dashboards.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(dashboards).where(eq(dashboards.id, id));
  },

  async getByAcademicYear(academicYearId: string) {
    return await db
      .select()
      .from(dashboards)
      .where(eq(dashboards.academicYearId, academicYearId));
  },
};
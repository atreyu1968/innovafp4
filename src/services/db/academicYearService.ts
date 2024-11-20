import { db } from '../../db';
import { academicYears } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { AcademicYear } from '../../types/academicYear';

export const academicYearService = {
  async getAll() {
    return await db.select().from(academicYears);
  },

  async getById(id: string) {
    const [year] = await db
      .select()
      .from(academicYears)
      .where(eq(academicYears.id, id));
    return year;
  },

  async create(year: Omit<AcademicYear, 'id'>) {
    const [newYear] = await db
      .insert(academicYears)
      .values({
        id: crypto.randomUUID(),
        ...year,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newYear;
  },

  async update(id: string, updates: Partial<AcademicYear>) {
    const [updated] = await db
      .update(academicYears)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(academicYears.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db
      .delete(academicYears)
      .where(eq(academicYears.id, id));
  },

  async getActive() {
    const [active] = await db
      .select()
      .from(academicYears)
      .where(eq(academicYears.status, 'active'));
    return active;
  },

  async setStatus(id: string, status: AcademicYear['status']) {
    const now = new Date();
    const [updated] = await db
      .update(academicYears)
      .set({
        status,
        updatedAt: now,
        ...(status === 'active' ? { activatedAt: now } : {}),
        ...(status === 'closed' ? { closedAt: now } : {}),
      })
      .where(eq(academicYears.id, id))
      .returning();
    return updated;
  },
};
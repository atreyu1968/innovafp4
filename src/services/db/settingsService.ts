import { db } from '../../db';
import { settings } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { AppSettings } from '../../types/settings';

export const settingsService = {
  async get() {
    const [currentSettings] = await db.select().from(settings);
    return currentSettings;
  },

  async update(updates: Partial<AppSettings>) {
    const [currentSettings] = await db.select().from(settings);
    
    if (currentSettings) {
      const [updated] = await db
        .update(settings)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, currentSettings.id))
        .returning();
      return updated;
    } else {
      const [newSettings] = await db
        .insert(settings)
        .values({
          id: crypto.randomUUID(),
          ...updates,
          updatedAt: new Date(),
        })
        .returning();
      return newSettings;
    }
  },
};
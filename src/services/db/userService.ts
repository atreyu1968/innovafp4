import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { User } from '../../types/user';

export const userService = {
  async getAll() {
    return await db.select().from(users);
  },

  async getById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  },

  async getByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  },

  async create(user: Omit<User, 'id'>) {
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newUser;
  },

  async update(id: string, updates: Partial<User>) {
    const [updated] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  },

  async resetPassword(id: string, newPassword: string) {
    const [updated] = await db
      .update(users)
      .set({
        password: newPassword,
        mustChangePassword: true,
        lastPasswordChange: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return updated;
  },
};
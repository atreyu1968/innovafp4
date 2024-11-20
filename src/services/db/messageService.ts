import { db } from '../../db';
import { messages } from '../../db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import type { Message } from '../../types/message';

export const messageService = {
  async getAll() {
    return await db.select().from(messages);
  },

  async getById(id: string) {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  },

  async create(message: Omit<Message, 'id'>) {
    const [newMessage] = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        ...message,
        createdAt: new Date(),
      })
      .returning();
    return newMessage;
  },

  async markAsRead(id: string) {
    const [updated] = await db
      .update(messages)
      .set({
        readAt: new Date(),
      })
      .where(eq(messages.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(messages).where(eq(messages.id, id));
  },

  async getConversation(userId1: string, userId2: string) {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, userId1),
            eq(messages.recipientId, userId2)
          ),
          and(
            eq(messages.senderId, userId2),
            eq(messages.recipientId, userId1)
          )
        )
      )
      .orderBy(messages.createdAt);
  },

  async getUnreadCount(userId: string) {
    const [result] = await db
      .select({
        count: db.fn.count(messages.id),
      })
      .from(messages)
      .where(
        and(
          eq(messages.recipientId, userId),
          isNull(messages.readAt)
        )
      );
    return Number(result.count);
  },
};
import { db } from '../../db';
import { forms, formResponses } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import type { Form, FormResponse } from '../../types/form';

export const formService = {
  async getAll() {
    return await db.select().from(forms);
  },

  async getById(id: string) {
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id));
    return form;
  },

  async create(form: Omit<Form, 'id'>) {
    const [newForm] = await db
      .insert(forms)
      .values({
        id: crypto.randomUUID(),
        ...form,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newForm;
  },

  async update(id: string, updates: Partial<Form>) {
    const [updated] = await db
      .update(forms)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    // Primero eliminamos las respuestas asociadas
    await db
      .delete(formResponses)
      .where(eq(formResponses.formId, id));
    
    // Luego eliminamos el formulario
    await db
      .delete(forms)
      .where(eq(forms.id, id));
  },

  async getByAcademicYear(academicYearId: string) {
    return await db
      .select()
      .from(forms)
      .where(eq(forms.academicYearId, academicYearId));
  },

  // Servicios para respuestas
  async getResponses(formId: string) {
    return await db
      .select()
      .from(formResponses)
      .where(eq(formResponses.formId, formId));
  },

  async createResponse(response: Omit<FormResponse, 'id'>) {
    const [newResponse] = await db
      .insert(formResponses)
      .values({
        id: crypto.randomUUID(),
        ...response,
        responseTimestamp: new Date(),
        lastModifiedTimestamp: new Date(),
      })
      .returning();
    return newResponse;
  },

  async updateResponse(id: string, updates: Partial<FormResponse>) {
    const [updated] = await db
      .update(formResponses)
      .set({
        ...updates,
        lastModifiedTimestamp: new Date(),
      })
      .where(eq(formResponses.id, id))
      .returning();
    return updated;
  },

  async deleteResponse(id: string) {
    await db
      .delete(formResponses)
      .where(eq(formResponses.id, id));
  },

  async getUserResponses(userId: string, formId: string) {
    return await db
      .select()
      .from(formResponses)
      .where(
        and(
          eq(formResponses.userId, userId),
          eq(formResponses.formId, formId)
        )
      );
  },
};
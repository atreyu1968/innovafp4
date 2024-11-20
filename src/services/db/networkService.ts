import { db } from '../../db';
import { subnets, centers, centerTypes, families } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { Subnet, EducationalCenter, CenterType, ProfessionalFamily } from '../../types/network';

export const networkService = {
  // Subredes
  async getAllSubnets() {
    return await db.select().from(subnets);
  },

  async createSubnet(subnet: Omit<Subnet, 'id'>) {
    const [newSubnet] = await db
      .insert(subnets)
      .values({
        id: crypto.randomUUID(),
        ...subnet,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newSubnet;
  },

  async updateSubnet(id: string, updates: Partial<Subnet>) {
    const [updated] = await db
      .update(subnets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(subnets.id, id))
      .returning();
    return updated;
  },

  async deleteSubnet(id: string) {
    await db.delete(subnets).where(eq(subnets.id, id));
  },

  // Centros
  async getAllCenters() {
    return await db.select().from(centers);
  },

  async createCenter(center: Omit<EducationalCenter, 'id'>) {
    const [newCenter] = await db
      .insert(centers)
      .values({
        id: crypto.randomUUID(),
        ...center,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newCenter;
  },

  async updateCenter(id: string, updates: Partial<EducationalCenter>) {
    const [updated] = await db
      .update(centers)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(centers.id, id))
      .returning();
    return updated;
  },

  async deleteCenter(id: string) {
    await db.delete(centers).where(eq(centers.id, id));
  },

  // Tipos de centro
  async getAllCenterTypes() {
    return await db.select().from(centerTypes);
  },

  async createCenterType(type: Omit<CenterType, 'id'>) {
    const [newType] = await db
      .insert(centerTypes)
      .values({
        id: crypto.randomUUID(),
        ...type,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newType;
  },

  async updateCenterType(id: string, updates: Partial<CenterType>) {
    const [updated] = await db
      .update(centerTypes)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(centerTypes.id, id))
      .returning();
    return updated;
  },

  async deleteCenterType(id: string) {
    await db.delete(centerTypes).where(eq(centerTypes.id, id));
  },

  // Familias profesionales
  async getAllFamilies() {
    return await db.select().from(families);
  },

  async createFamily(family: Omit<ProfessionalFamily, 'id'>) {
    const [newFamily] = await db
      .insert(families)
      .values({
        id: crypto.randomUUID(),
        ...family,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newFamily;
  },

  async updateFamily(id: string, updates: Partial<ProfessionalFamily>) {
    const [updated] = await db
      .update(families)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(families.id, id))
      .returning();
    return updated;
  },

  async deleteFamily(id: string) {
    await db.delete(families).where(eq(families.id, id));
  },
};
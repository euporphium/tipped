import { eq, desc, asc, and, gte, lte } from 'drizzle-orm';
import { db } from './index';
import { shifts, type Shift, type Shift_Insert } from './schema';

export class ShiftsRepository {
  /**
   * Create a new shift
   */
  async create(shiftData: Shift_Insert): Promise<Shift> {
    const [result] = await db.insert(shifts).values(shiftData);
    const shift = await this.findById(result.insertId);
    if (!shift) {
      throw new Error('Failed to create shift');
    }
    return shift;
  }

  /**
   * Get a shift by ID
   */
  async findById(id: number): Promise<Shift | null> {
    const [shift] = await db.select().from(shifts).where(eq(shifts.id, id));
    return shift || null;
  }

  /**
   * Get all shifts
   */
  async findAll(): Promise<Shift[]> {
    return await db.select().from(shifts).orderBy(desc(shifts.createdAt));
  }

  /**
   * Get shifts with pagination
   */
  async findWithPagination(limit: number, offset: number): Promise<Shift[]> {
    return await db
      .select()
      .from(shifts)
      .orderBy(desc(shifts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Update a shift by ID
   */
  async update(
    id: number,
    shiftData: Partial<Shift_Insert>,
  ): Promise<Shift | null> {
    await db
      .update(shifts)
      .set({ ...shiftData, updatedAt: new Date() })
      .where(eq(shifts.id, id));

    return await this.findById(id);
  }

  /**
   * Delete a shift by ID
   */
  async delete(id: number): Promise<boolean> {
    const [result] = await db.delete(shifts).where(eq(shifts.id, id));
    return result.affectedRows > 0;
  }

  /**
   * Get shifts within a date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Shift[]> {
    return await db
      .select()
      .from(shifts)
      .where(
        and(gte(shifts.shiftStart, startDate), lte(shifts.shiftEnd, endDate)),
      )
      .orderBy(asc(shifts.shiftStart));
  }

  /**
   * Get shifts with tips above a certain amount
   */
  async findByMinTips(minTips: number): Promise<Shift[]> {
    return await db
      .select()
      .from(shifts)
      .where(gte(shifts.tips, minTips))
      .orderBy(desc(shifts.tips));
  }

  /**
   * Get total tips for a date range
   */
  async getTotalTips(startDate: Date, endDate: Date): Promise<number> {
    const result = await db
      .select({ total: shifts.tips })
      .from(shifts)
      .where(
        and(gte(shifts.shiftStart, startDate), lte(shifts.shiftEnd, endDate)),
      );

    return result.reduce((sum, row) => sum + row.total, 0);
  }

  /**
   * Get average tips per shift
   */
  async getAverageTips(): Promise<number> {
    const result = await db.select({ avg: shifts.tips }).from(shifts);

    if (result.length === 0) return 0;

    const total = result.reduce((sum, row) => sum + row.avg, 0);
    return total / result.length;
  }

  /**
   * Get shifts for a specific day
   */
  async findByDay(date: Date): Promise<Shift[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.findByDateRange(startOfDay, endOfDay);
  }

  /**
   * Get recent shifts (last N shifts)
   */
  async getRecent(limit: number = 10): Promise<Shift[]> {
    return await db
      .select()
      .from(shifts)
      .orderBy(desc(shifts.createdAt))
      .limit(limit);
  }
}

// Export a singleton instance
export const shiftsRepository = new ShiftsRepository();

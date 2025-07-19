import { eq, desc, asc, and, gte, lte, sum, avg, min, max } from 'drizzle-orm';
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
    return db.select().from(shifts).orderBy(desc(shifts.createdAt));
  }

  /**
   * Get shifts with pagination
   */
  async findWithPagination(limit: number, offset: number): Promise<Shift[]> {
    return db
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
    return db
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
    return db
      .select()
      .from(shifts)
      .where(gte(shifts.tips, minTips))
      .orderBy(desc(shifts.tips));
  }

  /**
   * Get total tips, optionally filtered by date range
   */
  async getTotalTips(startDate?: Date, endDate?: Date): Promise<number> {
    const conditions = [];
    if (startDate) conditions.push(gte(shifts.shiftStart, startDate));
    if (endDate) conditions.push(lte(shifts.shiftEnd, endDate));

    const query = db.select({ total: sum(shifts.tips) }).from(shifts);

    if (conditions.length) {
      query.where(and(...conditions));
    }

    const [result] = await query;
    return Number(result?.total) ?? 0;
  }

  /**
   * Get average tips per shift
   */
  async getAverageTips(): Promise<number> {
    const [result] = await db.select({ avg: avg(shifts.tips) }).from(shifts);

    return Number(result?.avg) ?? 0;
  }

  /**
   * Get summary statistics, optionally filtered by date range
   */
  async getSummary(startDate?: Date, endDate?: Date) {
    const conditions = [];
    if (startDate) conditions.push(gte(shifts.shiftStart, startDate));
    if (endDate) conditions.push(lte(shifts.shiftEnd, endDate));

    const query = db
      .select({
        totalTips: sum(shifts.tips),
        totalShifts: sum(shifts.id),
        firstShift: min(shifts.shiftStart),
        lastShift: max(shifts.shiftEnd),
      })
      .from(shifts);

    if (conditions.length) {
      query.where(and(...conditions));
    }

    const [result] = await query;
    return {
      totalTips: Number(result?.totalTips) ?? 0,
      totalShifts: Number(result?.totalShifts) ?? 0,
      firstShift: result?.firstShift ? new Date(result.firstShift) : null,
      lastShift: result?.lastShift ? new Date(result.lastShift) : null,
    };
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
    return db
      .select()
      .from(shifts)
      .orderBy(desc(shifts.createdAt))
      .limit(limit);
  }
}

// Export a singleton instance
export const shiftsRepository = new ShiftsRepository();

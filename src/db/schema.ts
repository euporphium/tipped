import { sql } from 'drizzle-orm';
import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';

export const shifts = table(
  'shifts',
  {
    id: t.serial('id').primaryKey(),
    shiftStart: t.datetime('shift_start').notNull(),
    shiftEnd: t.datetime('shift_end').notNull(),
    tips: t.int('tips').notNull().default(0),
    createdAt: t.timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: t.timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => [
    t.check('tips_check', sql`${table.tips} >= 0`),
    t.check(
      'shift_duration_check',
      sql`
        ${table.shiftEnd} > ${table.shiftStart}
        AND TIMESTAMPDIFF(SECOND, ${table.shiftStart}, ${table.shiftEnd}) / 3600.0 >= 0.5
        AND TIMESTAMPDIFF(SECOND, ${table.shiftStart}, ${table.shiftEnd}) / 3600.0 <= 24
      `,
    ),
  ],
);

export type Shift_Insert = typeof shifts.$inferInsert;

export type Shift = typeof shifts.$inferSelect;

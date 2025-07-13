'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Shift } from '@/db/schema';

export const columns: ColumnDef<Shift>[] = [
  {
    accessorKey: 'shiftStart',
    header: 'Date',
    cell: ({ row }) => {
      const start = row.original.shiftStart;
      const end = row.original.shiftEnd;

      // Check if shift spans multiple days
      const startDate = start.toDateString();
      const endDate = end.toDateString();

      if (startDate === endDate) {
        return start.toLocaleDateString();
      } else {
        return `${start.toLocaleDateString()}*`;
      }
    },
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const start = row.original.shiftStart;
      const end = row.original.shiftEnd;
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return `${hours.toFixed(1)}h`;
    },
  },
  {
    accessorKey: 'tips',
    header: 'Tips',
    cell: ({ row }) => {
      return (
        <div className="flex justify-between font-mono">
          <span>$</span>
          <span>{row.original.tips}</span>
        </div>
      );
    },
  },
];

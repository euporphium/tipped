'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteShiftDialog } from '@/components/delete-shift-dialog';
import { Shift } from '@/db/schema';

// Separate component to manage dropdown state
function ActionsCell({ shift }: { shift: Shift }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDeleteSuccess = () => {
    setIsDropdownOpen(false);
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Shift Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(shift.id.toString())}
        >
          Copy shift ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/shifts/${shift.id}`)}>
          View shift details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteShiftDialog
          shift={shift}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Shift>[] = [
  {
    accessorKey: 'shiftStart',
    sortingFn: 'datetime',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
      return `${hours.toFixed(1)} hours`;
    },
  },
  {
    accessorKey: 'tips',
    header: 'Tips',
    cell: ({ row }) => {
      return (
        <div className="flex justify-between font-mono max-w-[6ch]">
          <span>$</span>
          <span>{row.original.tips}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <ActionsCell shift={row.original} />;
    },
  },
];

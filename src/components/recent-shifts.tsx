import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { AddShiftDialog } from '@/components/add-shift-dialog';
import { Shift } from '@/db/schema';
import { Button } from '@/components/ui/button';

interface ShiftHistoryProps {
  shifts: Shift[];
}

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};

export default function RecentShifts({ shifts }: ShiftHistoryProps) {
  return (
    <section>
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Recent Shifts</h2>
        <Button asChild variant="link" className="p-0">
          <Link
            href="/shifts"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            View all
          </Link>
        </Button>
      </header>
      <div className="mb-3 flex flex-col gap-3">
        {shifts.map((shift) => {
          const startTime = shift.shiftStart.toLocaleTimeString(
            'en-US',
            TIME_FORMAT_OPTIONS,
          );
          const endTime = shift.shiftEnd.toLocaleTimeString(
            'en-US',
            TIME_FORMAT_OPTIONS,
          );

          return (
            <div key={shift.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CalendarClock className="text-muted-foreground mx-1 h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">
                  {shift.shiftStart.toLocaleDateString(
                    'en-US',
                    DATE_FORMAT_OPTIONS,
                  )}
                </div>
                <div className="text-muted-foreground text-sm">
                  {startTime} - {endTime}
                </div>
              </div>
              <div className="flex-shrink-0 font-semibold">${shift.tips}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

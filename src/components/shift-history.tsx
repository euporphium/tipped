import { Shift } from '@/db/schema';
import { CalendarClock } from 'lucide-react';

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

export default function ShiftHistory({ shifts }: ShiftHistoryProps) {
  return (
    <section className="p-3">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">History</h2>
        <a
          href="/shifts"
          className="text-sm text-blue-600 underline transition-colors hover:text-blue-800"
        >
          View all
        </a>
      </header>
      <div className="flex flex-col gap-3">
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
              <div className="flex-shrink-0 font-semibold">
                ${shift.tips.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

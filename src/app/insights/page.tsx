import { shiftsRepository } from '@/db';
import { HourlyRateChart } from '@/components/hourly-rate-chart';
import { TipsPerShiftChart } from '@/components/tips-per-shift-chart';
import { DayOfWeekChart } from '@/components/day-of-week-chart';
import { Shift } from '@/db/schema';

async function getAllShifts(): Promise<Shift[]> {
  return shiftsRepository.findAll();
}

export default async function InsightsPage() {
  const shifts = await getAllShifts();

  return (
    <div className="container mx-auto p-2">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analytics and performance metrics for your shifts
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Hourly Rate Trends</h2>
            <HourlyRateChart shifts={shifts} />
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Tips Per Shift Analysis
            </h2>
            <TipsPerShiftChart shifts={shifts} />
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Day of Week Performance
            </h2>
            <DayOfWeekChart shifts={shifts} />
          </div>
        </div>
      </div>
    </div>
  );
}

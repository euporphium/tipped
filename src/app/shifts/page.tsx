import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { shiftsRepository } from '@/db';
import { AddShiftDialog } from '@/components/add-shift-dialog';
import { HourlyRateChart } from '@/components/hourly-rate-chart';
import { TipsPerShiftChart } from '@/components/tips-per-shift-chart';

async function getAllShifts(): Promise<Shift[]> {
  return shiftsRepository.findAll();
}

export default async function DemoPage() {
  const shifts = await getAllShifts();

  return (
    <div className="container mx-auto p-2">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shifts</h1>
          <AddShiftDialog />
        </div>
        <DataTable columns={columns} data={shifts} />
        <HourlyRateChart shifts={shifts} />
        <TipsPerShiftChart shifts={shifts} />
      </div>
    </div>
  );
}

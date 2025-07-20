import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { shiftsRepository } from '@/db';

async function getAllShifts(): Promise<Shift[]> {
  return shiftsRepository.findAll();
}

export default async function DemoPage() {
  const shifts = await getAllShifts();

  return (
    <div className="container mx-auto p-2">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Shifts</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your recorded shifts
          </p>
        </div>
        <DataTable columns={columns} data={shifts} />
      </div>
    </div>
  );
}

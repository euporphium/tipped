import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { shiftsRepository } from '@/db';
import { AddShiftDialog } from '@/components/add-shift-dialog';

async function getData(): Promise<Shift[]> {
  const shifts = await shiftsRepository.findAll();
  return shifts;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-2">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Shifts</h1>
          <AddShiftDialog />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

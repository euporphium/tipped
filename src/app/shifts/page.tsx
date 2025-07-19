import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { shiftsRepository } from '@/db';
import { AddShiftDialog } from '@/components/add-shift-dialog';

async function getData(): Promise<Shift[]> {
  return shiftsRepository.findAll();
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-2">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shifts</h1>
          <AddShiftDialog />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

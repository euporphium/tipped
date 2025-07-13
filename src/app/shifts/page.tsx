import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { decemberShifts } from './mock';
import { shiftsRepository } from '@/db';

async function getData(): Promise<Shift[]> {
  const shifts = await shiftsRepository.findAll();
  return shifts;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

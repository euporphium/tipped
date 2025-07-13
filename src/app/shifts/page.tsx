import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { aprilShifts } from './mock';

async function getData(): Promise<Shift[]> {
  return Promise.resolve(aprilShifts);
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

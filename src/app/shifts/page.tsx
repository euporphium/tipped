import { Shift } from '@/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';
import { decemberShifts } from './mock';

async function getData(): Promise<Shift[]> {
  return Promise.resolve(decemberShifts);
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

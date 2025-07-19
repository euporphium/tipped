import ShiftHistory from '@/components/shift-history';
import Actions from '@/components/actions';
import SummaryCard from '@/components/summary-card';
import { shiftsRepository } from '@/db';

async function getRecentShifts() {
  return await shiftsRepository.getRecent(5);
}

async function getSummary() {
  return await shiftsRepository.getSummary();
}

export default async function Home() {
  const recentShifts = await getRecentShifts();
  const summary = await getSummary();

  return (
    <div>
      <section className="p-3">
        <SummaryCard summary={summary} />
      </section>
      <Actions />
      <ShiftHistory shifts={recentShifts} />
    </div>
  );
}

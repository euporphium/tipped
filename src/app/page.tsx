import RecentShifts from '@/components/recent-shifts';
import SummarySection from '@/components/summary-section';
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
      <SummarySection summary={summary} />
      <RecentShifts shifts={recentShifts} />
    </div>
  );
}

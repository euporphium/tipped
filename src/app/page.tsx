import RecentShifts from '@/components/recent-shifts';
import Summary from '@/components/summary';
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
    <div className="container mx-auto p-2">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your recent shifts and performance summary
          </p>
        </div>
        <Summary summary={summary} />
        <RecentShifts shifts={recentShifts} />
      </div>
    </div>
  );
}

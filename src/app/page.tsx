import ShiftHistory from '@/components/shift-history';
import TrackTipsSection from '@/components/track-tips-section';
import { shiftsRepository } from '@/db';

async function getRecentShifts() {
  return await shiftsRepository.getRecent(5);
}

export default async function Home() {
  const recentShifts = await getRecentShifts();

  return (
    <div>
      <TrackTipsSection />
      <ShiftHistory shifts={recentShifts} />
    </div>
  );
}

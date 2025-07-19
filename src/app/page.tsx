import ShiftHistory from '@/components/shift-history';
import TrackTipsSection from '@/components/track-tips-section';
import { shiftsRepository } from '@/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">${summary.totalTips}</div>
              <div>
                <span className="text-muted-foreground text-sm">
                  In {summary.totalShifts} shifts
                </span>
                {summary.firstShift && summary.lastShift && (
                  <span className="text-muted-foreground text-xs">
                    {' '}
                    from {summary.firstShift.toLocaleDateString()} -{' '}
                    {summary.lastShift.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <TrackTipsSection />
      <ShiftHistory shifts={recentShifts} />
    </div>
  );
}

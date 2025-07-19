import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardProps {
  summary: {
    totalTips: number;
    totalShifts: number;
    firstShift: Date | null;
    lastShift: Date | null;
  };
}

function formatDateRange(firstShift: Date | null, lastShift: Date | null) {
  if (!firstShift || !lastShift) return null;

  const first = firstShift.toLocaleDateString();
  const last = lastShift.toLocaleDateString();

  return first === last ? `on ${first}` : `from ${first} - ${last}`;
}

function getSubtitleText(summary: SummaryCardProps['summary']) {
  const { totalShifts, firstShift, lastShift } = summary;

  if (totalShifts === 0) {
    return 'Add a shift to get started with tip tracking.';
  }

  const shiftsText = `In ${totalShifts} shift${totalShifts === 1 ? '' : 's'}`;
  const dateRange = formatDateRange(firstShift, lastShift);

  return dateRange ? `${shiftsText} ${dateRange}` : shiftsText;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">${summary.totalTips}</div>
          <div className="text-muted-foreground text-xs">
            {getSubtitleText(summary)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

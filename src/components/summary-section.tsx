import Link from 'next/link';

interface SummarySectionProps {
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

function getSubtitleText(summary: SummarySectionProps['summary']) {
  const { totalShifts, firstShift, lastShift } = summary;

  if (totalShifts === 0) {
    return 'Add a shift to get started.';
    // return 'Add your first shift to unlock tip insights.'; // TODO Implement Insights card
  }

  const shiftsText = `In ${totalShifts} shift${totalShifts === 1 ? '' : 's'}`;
  const dateRange = formatDateRange(firstShift, lastShift);

  return dateRange ? `${shiftsText} ${dateRange}` : shiftsText;
}

export default function SummarySection({ summary }: SummarySectionProps) {
  return (
    <section className="p-3">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Summary</h2>
        {summary.totalShifts > 0 && (
          <Link
            href="/insights"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            View Insights →
          </Link>
        )}
      </header>
      <div className="space-y-2">
        <div className="text-2xl font-bold">${summary.totalTips}</div>
        <div className="text-muted-foreground text-xs">
          {getSubtitleText(summary)}
        </div>
      </div>
    </section>
  );
}

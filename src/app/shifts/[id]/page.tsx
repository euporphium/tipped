import { notFound } from 'next/navigation';
import { shiftsRepository } from '@/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShiftPageProps {
  params: {
    id: string;
  };
}

export default async function ShiftPage({ params }: ShiftPageProps) {
  const shiftId = parseInt(params.id);

  if (isNaN(shiftId)) {
    notFound();
  }

  const shift = await shiftsRepository.findById(shiftId);

  if (!shift) {
    notFound();
  }

  return (
    <div className="container mx-auto p-2">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Shift ID: {shift.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Start Time
                </label>
                <p className="text-lg">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(shift.shiftStart))}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  End Time
                </label>
                <p className="text-lg">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(shift.shiftEnd))}
                </p>
              </div>
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Tips Earned
              </label>
              <p className="text-2xl font-bold text-green-600">${shift.tips}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Duration
                </label>
                <p className="text-lg">
                  {Math.round(
                    ((new Date(shift.shiftEnd).getTime() -
                      new Date(shift.shiftStart).getTime()) /
                      (1000 * 60 * 60)) *
                      10,
                  ) / 10}{' '}
                  hours
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Hourly Rate
                </label>
                <p className="text-lg">
                  $
                  {(
                    shift.tips /
                    ((new Date(shift.shiftEnd).getTime() -
                      new Date(shift.shiftStart).getTime()) /
                      (1000 * 60 * 60))
                  ).toFixed(2)}
                  /hr
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Created
                </label>
                <p className="text-sm">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(shift.createdAt))}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Last Updated
                </label>
                <p className="text-sm">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(shift.updatedAt))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <a
            href="/shifts"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            ← Back to Shifts
          </a>
        </div>
      </div>
    </div>
  );
}

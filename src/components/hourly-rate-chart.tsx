'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Shift } from '@/db/schema';

interface HourlyRateData {
  date: string;
  hourlyRate: number;
  shiftId: number;
}

interface HourlyRateChartProps {
  shifts: Shift[];
  loading?: boolean;
  error?: string | null;
}

export function HourlyRateChart({
  shifts,
  loading = false,
  error = null,
}: HourlyRateChartProps) {
  const data: HourlyRateData[] = shifts
    .map((shift) => {
      const startTime = new Date(shift.shiftStart);
      const endTime = new Date(shift.shiftEnd);
      const hoursWorked =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      // Skip shifts with invalid duration or zero hours
      if (hoursWorked <= 0) return null;

      const hourlyRate = shift.tips / hoursWorked;

      return {
        date: startTime.toISOString().split('T')[0], // YYYY-MM-DD format
        hourlyRate: Math.round(hourlyRate * 100) / 100, // Round to 2 decimal places
        shiftId: shift.id,
      };
    })
    .filter((item): item is HourlyRateData => item !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartConfig = {
    hourlyRate: {
      label: 'Hourly Rate ($/hr)',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <p className="text-destructive">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No shift data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mx = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Rate Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <ChartTooltip
              content={({
                active,
                payload,
                label,
                coordinate,
                accessibilityLayer,
              }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as HourlyRateData;
                  return (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={label}
                      coordinate={coordinate}
                      accessibilityLayer={accessibilityLayer}
                      labelFormatter={(label) => {
                        const date = new Date(label as string);
                        return date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                      }}
                    />
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="hourlyRate"
              stroke="var(--color-hourlyRate)"
              dot={{ fill: 'var(--color-hourlyRate)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

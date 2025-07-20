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

interface TipsPerShiftData {
  date: string;
  tips: number;
  shiftId: number;
}

interface TipsPerShiftChartProps {
  shifts: Shift[];
  loading?: boolean;
  error?: string | null;
}

export function TipsPerShiftChart({
  shifts,
  loading = false,
  error = null,
}: TipsPerShiftChartProps) {
  const data: TipsPerShiftData[] = shifts
    .map((shift) => {
      const startTime = new Date(shift.shiftStart);

      return {
        date: startTime.toISOString().split('T')[0], // YYYY-MM-DD format
        tips: shift.tips,
        shiftId: shift.id,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartConfig = {
    tips: {
      label: 'Tips',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tips Per Shift</CardTitle>
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
          <CardTitle>Tips Per Shift</CardTitle>
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
          <CardTitle>Tips Per Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No shift data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tips Per Shift</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
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
                      valueFormatter={(value) =>
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(Number(value))
                      }
                    />
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="tips"
              stroke="var(--color-tips)"
              dot={{ fill: 'var(--color-tips)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

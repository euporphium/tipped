'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Shift } from '@/db/schema';
import { ChartLegendContent } from '@/components/ui/chart';

interface DayOfWeekData {
  dayOfWeek: number;
  dayName: string;
  tipsPerShift: number;
  tipsPerHour: number;
}

interface DayOfWeekChartProps {
  shifts: Shift[];
  loading?: boolean;
  error?: string | null;
}

export function DayOfWeekChart({
  shifts,
  loading = false,
  error = null,
}: DayOfWeekChartProps) {
  // Group shifts by day of week and calculate averages
  const dayOfWeekMap = new Map<
    number,
    { totalTips: number; totalHours: number; count: number }
  >();

  shifts.forEach((shift) => {
    const startTime = new Date(shift.shiftStart);
    const endTime = new Date(shift.shiftEnd);
    const hoursWorked =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Skip shifts with invalid duration
    if (hoursWorked <= 0) return;

    const dayOfWeek = startTime.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const existing = dayOfWeekMap.get(dayOfWeek) || {
      totalTips: 0,
      totalHours: 0,
      count: 0,
    };
    dayOfWeekMap.set(dayOfWeek, {
      totalTips: existing.totalTips + shift.tips,
      totalHours: existing.totalHours + hoursWorked,
      count: existing.count + 1,
    });
  });

  const data: DayOfWeekData[] = Array.from(dayOfWeekMap.entries())
    .map(([dayOfWeek, stats]) => {
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      return {
        dayOfWeek,
        dayName: dayNames[dayOfWeek],
        tipsPerShift: Math.round((stats.totalTips / stats.count) * 100) / 100,
        tipsPerHour:
          Math.round((stats.totalTips / stats.totalHours) * 100) / 100,
      };
    })
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const chartConfig = {
    tipsPerShift: {
      label: 'Tips per shift',
      color: 'var(--chart-1)',
    },
    tipsPerHour: {
      label: 'Tips per hour',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tips by Day of Week</CardTitle>
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
          <CardTitle>Tips by Day of Week</CardTitle>
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
          <CardTitle>Tips by Day of Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No shift data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tips by Day of Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-square sm:aspect-video"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 5, left: -0, bottom: 5 }}
            // margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => `$${value}`} />
            <YAxis
              type="category"
              dataKey="dayName"
              interval={0}
              tickLine={false}
              axisLine={false}
              width={80}
            />

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
                      labelFormatter={(label) => `${label} tip averages`}
                      valueFormatter={(value) => (
                        <span className="pl-2">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(Number(value))}
                        </span>
                      )}
                    />
                  );
                }
                return null;
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="tipsPerShift" fill="var(--color-tipsPerShift)" />
            <Bar dataKey="tipsPerHour" fill="var(--color-tipsPerHour)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

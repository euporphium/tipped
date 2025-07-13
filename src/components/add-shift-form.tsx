'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/date-picker';
import { Shift_Insert } from '@/db/schema';

// Helper function to combine date and time
const combineDateAndTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes, 0, 0);
  return combinedDate;
};

const formSchema = z
  .object({
    shiftStart: z.date(),
    shiftEnd: z.date(),
    shiftStartTime: z.string(),
    shiftEndTime: z.string(),
    tips: z.number().min(0),
  })
  .refine(
    (data) => {
      const startDate = combineDateAndTime(
        data.shiftStart,
        data.shiftStartTime,
      );
      const endDate = combineDateAndTime(data.shiftEnd, data.shiftEndTime);

      return endDate > startDate;
    },
    {
      message: 'End date and time must be after start date and time',
      path: ['shiftEnd'],
    },
  );

type ShiftForm = z.infer<typeof formSchema>;

export const AddShiftForm = ({
  onAddShift,
  isSubmitting = false,
}: {
  onAddShift: (shift: Shift_Insert) => void;
  isSubmitting?: boolean;
}) => {
  const form = useForm<ShiftForm>({
    defaultValues: {
      shiftStart: new Date(),
      shiftEnd: new Date(),
      shiftStartTime: '09:00',
      shiftEndTime: new Date().toTimeString().slice(0, 5),
      tips: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: ShiftForm) => {
    // Combine date and time for shift start and end
    const startDate = combineDateAndTime(data.shiftStart, data.shiftStartTime);
    const endDate = combineDateAndTime(data.shiftEnd, data.shiftEndTime);

    // Convert the form data to match the database schema
    const shiftData: Shift_Insert = {
      shiftStart: startDate,
      shiftEnd: endDate,
      tips: data.tips,
    };
    onAddShift(shiftData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="shiftStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shiftStartTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="shiftEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift End Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shiftEndTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tips"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tips Earned</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  min={0}
                  placeholder="Tips Earned"
                  // Ensure value is an empty string if field.value is null, undefined, or NaN
                  // Otherwise, it should be the number itself.
                  value={
                    field.value === null || isNaN(field.value)
                      ? ''
                      : field.value
                  }
                  onChange={(e) => {
                    const stringValue = e.target.value;
                    if (stringValue === '') {
                      // If input is empty, set RHF value to null (or undefined)
                      field.onChange(null);
                    } else {
                      // Otherwise, parse as float. RHF will store it as a number.
                      // Zod validation will handle non-numeric input if any.
                      field.onChange(parseFloat(stringValue));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Shift'}
        </Button>
      </form>
    </Form>
  );
};

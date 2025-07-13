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

const formSchema = z
  .object({
    shiftStart: z.date(),
    shiftEnd: z.date(),
    tips: z.number().min(0),
  })
  .refine((data) => data.shiftEnd > data.shiftStart, {
    message: 'End time must be after start time',
    path: ['shiftEnd'],
  });

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
      tips: 0,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: ShiftForm) => {
    // Convert the form data to match the database schema
    const shiftData: Shift_Insert = {
      shiftStart: data.shiftStart,
      shiftEnd: data.shiftEnd,
      tips: data.tips,
    };
    onAddShift(shiftData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="shiftStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift Start</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  // includeTime={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shiftEnd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift End</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  // includeTime={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
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

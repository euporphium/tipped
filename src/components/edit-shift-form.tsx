'use client';

import { useForm } from 'react-hook-form';
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
import { Shift_Insert, Shift } from '@/db/schema';
import {
  shiftFormSchema,
  combineDateAndTime,
  extractTimeString,
  type ShiftForm,
} from '@/lib/validations';

export const EditShiftForm = ({
  shift,
  onUpdateShift,
  isSubmitting = false,
}: {
  shift: Shift;
  onUpdateShift: (shift: Shift_Insert) => void;
  isSubmitting?: boolean;
}) => {
  const form = useForm<ShiftForm>({
    defaultValues: {
      shiftStart: shift.shiftStart,
      shiftEnd: shift.shiftEnd,
      shiftStartTime: extractTimeString(shift.shiftStart),
      shiftEndTime: extractTimeString(shift.shiftEnd),
      tips: shift.tips,
    },
    resolver: zodResolver(shiftFormSchema),
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
    onUpdateShift(shiftData);
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
          {isSubmitting ? 'Updating...' : 'Update Shift'}
        </Button>
      </form>
    </Form>
  );
};

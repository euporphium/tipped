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
import { Shift_Insert } from '@/db/schema';
import {
  shiftFormSchema,
  combineDateAndTime,
  calculateEndDate,
  type ShiftForm,
} from '@/lib/validations';

interface ShiftFormComponentProps {
  initialShift?: {
    shiftDate: Date;
    shiftStartTime: string;
    shiftEndTime: string;
    tips?: number;
  };
  onSubmitShift: (shift: Shift_Insert) => void;
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
}

export const ShiftFormComponent = ({
  initialShift,
  onSubmitShift,
  isSubmitting = false,
  submitText = 'Save Shift',
  submittingText = 'Saving...',
}: ShiftFormComponentProps) => {
  const form = useForm<ShiftForm>({
    defaultValues: initialShift ?? {
      shiftDate: new Date(),
      shiftStartTime: '09:00',
      shiftEndTime: new Date().toTimeString().slice(0, 5),
      tips: undefined,
    },
    resolver: zodResolver(shiftFormSchema),
  });

  const onSubmit = (data: ShiftForm) => {
    // Combine date and time for shift start and end
    const startDate = combineDateAndTime(data.shiftDate, data.shiftStartTime);
    const endDate = calculateEndDate(
      data.shiftDate,
      data.shiftStartTime,
      data.shiftEndTime,
    );

    // Convert the form data to match the database schema
    const shiftData: Shift_Insert = {
      shiftStart: startDate,
      shiftEnd: endDate,
      tips: data.tips ?? 0,
    };
    onSubmitShift(shiftData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="shiftDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift Date</FormLabel>
              <FormControl>
                <DatePicker date={field.value} onDateChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Tips Earned"
                  // Ensure value is an empty string if field.value is null, undefined, or NaN
                  // Otherwise, it should be the number itself.
                  value={
                    field.value === undefined || isNaN(field.value)
                      ? ''
                      : field.value
                  }
                  onChange={(e) => {
                    const stringValue = e.target.value;
                    if (stringValue === '') {
                      // If input is empty, set RHF value to undefined
                      field.onChange(undefined);
                    } else {
                      // Parse as integer - the input restrictions should prevent decimals
                      const intValue = parseInt(stringValue, 10);
                      if (!isNaN(intValue)) {
                        field.onChange(intValue);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingText : submitText}
        </Button>
      </form>
    </Form>
  );
};

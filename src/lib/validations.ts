import { z } from 'zod';
import { Shift_Insert } from '@/db/schema';

// Helper function to combine date and time
export const combineDateAndTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes, 0, 0);
  return combinedDate;
};

// Helper function to extract time string from date
export const extractTimeString = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

// Form schema for shift creation/editing
export const shiftFormSchema = z
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

export type ShiftForm = z.infer<typeof shiftFormSchema>;

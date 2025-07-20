import { z } from 'zod';
import { Shift_Insert } from '@/db/schema';

// Helper function to combine date and time
export const combineDateAndTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes, 0, 0);
  return combinedDate;
};

// Helper function to calculate end date, handling shifts that end after midnight
export const calculateEndDate = (
  startDate: Date,
  startTime: string,
  endTime: string,
): Date => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  // Convert to minutes for easier comparison
  const startMinutesTotal = startHours * 60 + startMinutes;
  const endMinutesTotal = endHours * 60 + endMinutes;

  // If end time is before start time, the shift ends on the next day
  const endDate = new Date(startDate);
  if (endMinutesTotal < startMinutesTotal) {
    endDate.setDate(endDate.getDate() + 1);
  }

  endDate.setHours(endHours, endMinutes, 0, 0);
  return endDate;
};

// Helper function to extract time string from date
export const extractTimeString = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

// Form schema for shift creation/editing
export const shiftFormSchema = z
  .object({
    shiftDate: z.date(),
    shiftStartTime: z.string(),
    shiftEndTime: z.string(),
    tips: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      // For shifts ending after midnight, end time can be before start time
      // We'll handle the date logic in the form submission
      const [startHours, startMinutes] = data.shiftStartTime
        .split(':')
        .map(Number);
      const [endHours, endMinutes] = data.shiftEndTime.split(':').map(Number);

      // Convert to minutes for easier comparison
      const startMinutesTotal = startHours * 60 + startMinutes;
      const endMinutesTotal = endHours * 60 + endMinutes;

      // Allow end time to be before start time (indicating next day)
      // But ensure the shift is at least 30 minutes long
      const durationMinutes =
        endMinutesTotal >= startMinutesTotal
          ? endMinutesTotal - startMinutesTotal
          : 24 * 60 - startMinutesTotal + endMinutesTotal;

      return durationMinutes >= 30;
    },
    {
      message: 'Shift must be at least 30 minutes long',
      path: ['shiftEndTime'],
    },
  );

export type ShiftForm = z.infer<typeof shiftFormSchema>;

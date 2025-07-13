'use server';

import { revalidatePath } from 'next/cache';
import { shiftsRepository } from '@/db/shiftsRepository';
import { Shift_Insert } from '@/db/schema';

export async function addShift(shiftData: Shift_Insert) {
  try {
    // Validate the shift data
    if (!shiftData.shiftStart || !shiftData.shiftEnd) {
      return { success: false, error: 'Start and end times are required' };
    }

    if (shiftData.shiftEnd <= shiftData.shiftStart) {
      return { success: false, error: 'End time must be after start time' };
    }

    if ((shiftData.tips ?? 0) < 0) {
      return { success: false, error: 'Tips cannot be negative' };
    }

    // Create the shift
    const newShift = await shiftsRepository.create(shiftData);

    // Revalidate the shifts page to refresh the data
    revalidatePath('/shifts');

    return { success: true, data: newShift };
  } catch (error) {
    console.error('Error adding shift:', error);
    return { success: false, error: 'Internal server error' };
  }
}

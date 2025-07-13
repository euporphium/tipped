'use server';

import { revalidatePath } from 'next/cache';
import { shiftsRepository } from '@/db/shiftsRepository';
import { Shift_Insert } from '@/db/schema';

export async function updateShift(id: number, shiftData: Shift_Insert) {
  try {
    const updatedShift = await shiftsRepository.update(id, shiftData);

    if (!updatedShift) {
      return { success: false, error: 'Shift not found' };
    }

    // Revalidate the page to refresh the data
    revalidatePath('/shifts');

    return { success: true, data: updatedShift };
  } catch (error) {
    console.error('Error updating shift:', error);
    return { success: false, error: 'Internal server error' };
  }
}

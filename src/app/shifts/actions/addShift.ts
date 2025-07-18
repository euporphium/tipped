'use server';

import { revalidatePath } from 'next/cache';
import { shiftsRepository } from '@/db/shiftsRepository';
import { Shift_Insert } from '@/db/schema';

export async function addShift(shiftData: Shift_Insert) {
  try {
    const newShift = await shiftsRepository.create(shiftData);

    // Revalidate the page to refresh the data
    revalidatePath('/shifts');

    return { success: true, data: newShift };
  } catch (error) {
    console.error('Error adding shift:', error);
    return { success: false, error: 'Internal server error' };
  }
}

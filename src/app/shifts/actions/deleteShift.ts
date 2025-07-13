'use server';

import { revalidatePath } from 'next/cache';
import { shiftsRepository } from '@/db/shiftsRepository';

export async function deleteShift(id: number) {
  try {
    if (isNaN(id)) {
      return { success: false, error: 'Invalid shift ID' };
    }

    const success = await shiftsRepository.delete(id);

    if (!success) {
      return { success: false, error: 'Shift not found' };
    }

    // Revalidate the page to refresh the data
    revalidatePath('/shifts');

    return { success: true };
  } catch (error) {
    console.error('Error deleting shift:', error);
    return { success: false, error: 'Internal server error' };
  }
}

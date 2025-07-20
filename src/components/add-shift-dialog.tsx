'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShiftDialog } from '@/components/shift-dialog';
import { ShiftFormComponent } from '@/components/shift-form';
import { Shift_Insert } from '@/db/schema';
import { Plus } from 'lucide-react';
import { addShift } from '@/app/shifts/actions';

export function AddShiftDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddShift = async (shift: Shift_Insert) => {
    setIsSubmitting(true);
    try {
      const result = await addShift(shift);

      if (result.success) {
        setOpen(false);
        // The page will automatically refresh due to revalidatePath
      } else {
        console.error('Failed to add shift:', result.error);
        alert(`Failed to add shift: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding shift:', error);
      alert('Failed to add shift. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ShiftDialog
      trigger={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Shift
        </Button>
      }
      title="Add New Shift"
      description="Enter the details for your new shift. Click save when you're done."
      open={open}
      onOpenChange={setOpen}
    >
      <ShiftFormComponent
        onSubmitShift={handleAddShift}
        isSubmitting={isSubmitting}
        submitText="Save Shift"
        submittingText="Saving..."
      />
    </ShiftDialog>
  );
}

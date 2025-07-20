'use client';

import { useState } from 'react';
import { updateShift } from '@/app/shifts/actions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ShiftDialog } from '@/components/shift-dialog';
import { ShiftFormComponent } from '@/components/shift-form';
import { Shift, Shift_Insert } from '@/db/schema';
import { extractTimeString } from '@/lib/validations';

interface EditShiftDialogProps {
  shift: Shift;
  onEditSuccess?: () => void;
}

export function EditShiftDialog({
  shift,
  onEditSuccess,
}: EditShiftDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (shiftData: Shift_Insert) => {
    setIsUpdating(true);
    try {
      const result = await updateShift(shift.id, shiftData);

      if (result.success) {
        // Call the callback to close the parent dropdown
        onEditSuccess?.();
        // Close the dialog
        setIsOpen(false);
        // The page will automatically refresh due to revalidatePath
      } else {
        console.error('Failed to update shift:', result.error);
        alert(`Failed to update shift: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating shift:', error);
      alert('Failed to update shift. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ShiftDialog
      trigger={
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          Edit shift
        </DropdownMenuItem>
      }
      title="Edit Shift"
      description={`Update the details for your shift from ${shift.shiftStart.toLocaleDateString()}.`}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <ShiftFormComponent
        initialShift={{
          shiftDate: shift.shiftStart,
          shiftStartTime: extractTimeString(shift.shiftStart),
          shiftEndTime: extractTimeString(shift.shiftEnd),
          tips: shift.tips,
        }}
        onSubmitShift={handleUpdate}
        isSubmitting={isUpdating}
        submitText="Update Shift"
        submittingText="Updating..."
      />
    </ShiftDialog>
  );
}

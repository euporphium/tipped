'use client';

import { useState } from 'react';
import { updateShift } from '@/app/shifts/actions';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Shift, Shift_Insert } from '@/db/schema';
import { EditShiftForm } from './edit-shift-form';

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          Edit shift
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
          <DialogDescription>
            Update the details for your shift from{' '}
            {shift.shiftStart.toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <EditShiftForm
          shift={shift}
          onUpdateShift={handleUpdate}
          isSubmitting={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}

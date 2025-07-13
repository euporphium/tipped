'use client';

import { useState } from 'react';
import { deleteShift } from '@/app/shifts/actions';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Shift } from '@/db/schema';

interface DeleteShiftDialogProps {
  shift: Shift;
  onDeleteSuccess?: () => void;
}

export function DeleteShiftDialog({
  shift,
  onDeleteSuccess,
}: DeleteShiftDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteShift(shift.id);

      if (result.success) {
        // Call the callback to close the parent dropdown
        onDeleteSuccess?.();
        // The page will automatically refresh due to revalidatePath
      } else {
        console.error('Failed to delete shift:', result.error);
        alert(`Failed to delete shift: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Failed to delete shift. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive"
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          Delete shift
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the shift
            from {shift.shiftStart.toLocaleDateString()} with ${shift.tips} in
            tips.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

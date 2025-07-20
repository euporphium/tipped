import { useState, useCallback } from 'react';
import { Shift, Shift_Insert } from '@/db/schema';
import { updateShift } from '@/app/shifts/actions';

interface UseEditShiftDialogOptions {
  shift: Shift;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  autoClose?: boolean;
}

interface UseEditShiftDialogReturn {
  open: boolean;
  isSubmitting: boolean;
  error: string | null;
  openDialog: () => void;
  closeDialog: () => void;
  handleOpenChange: (open: boolean) => void;
  handleUpdateShift: (shiftData: Shift_Insert) => Promise<void>;
  resetError: () => void;
}

export function useEditShiftDialog(
  options: UseEditShiftDialogOptions,
): UseEditShiftDialogReturn {
  const { shift, onSuccess, onError, autoClose = true } = options;

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback(() => {
    setOpen(true);
    setError(null);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (isOpen) {
      setOpen(true);
      setError(null);
    } else {
      setOpen(false);
      setError(null);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const handleUpdateShift = useCallback(
    async (shiftData: Shift_Insert) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await updateShift(shift.id, shiftData);

        if (result.success) {
          if (autoClose) {
            closeDialog();
          }
          onSuccess?.();
          // The page will automatically refresh due to revalidatePath
        } else {
          const errorMessage = result.error || 'Failed to update shift';
          setError(errorMessage);
          onError?.(errorMessage);
          console.error('Failed to update shift:', result.error);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update shift. Please try again.';
        setError(errorMessage);
        onError?.(errorMessage);
        console.error('Error updating shift:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [shift.id, autoClose, closeDialog, onSuccess, onError],
  );

  return {
    open,
    isSubmitting,
    error,
    openDialog,
    closeDialog,
    handleOpenChange,
    handleUpdateShift,
    resetError,
  };
}

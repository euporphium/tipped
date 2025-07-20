import { useState, useCallback } from 'react';
import { Shift_Insert } from '@/db/schema';
import { addShift } from '@/app/shifts/actions';

interface UseAddShiftDialogOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  autoClose?: boolean;
}

interface UseAddShiftDialogReturn {
  open: boolean;
  isSubmitting: boolean;
  error: string | null;
  openDialog: () => void;
  closeDialog: () => void;
  handleOpenChange: (open: boolean) => void;
  handleAddShift: (shift: Shift_Insert) => Promise<void>;
  resetError: () => void;
}

export function useAddShiftDialog(
  options: UseAddShiftDialogOptions = {},
): UseAddShiftDialogReturn {
  const { onSuccess, onError, autoClose = true } = options;

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

  const handleAddShift = useCallback(
    async (shift: Shift_Insert) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await addShift(shift);

        if (result.success) {
          if (autoClose) {
            closeDialog();
          }
          onSuccess?.();
          // The page will automatically refresh due to revalidatePath
        } else {
          const errorMessage = result.error || 'Failed to add shift';
          setError(errorMessage);
          onError?.(errorMessage);
          console.error('Failed to add shift:', result.error);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to add shift. Please try again.';
        setError(errorMessage);
        onError?.(errorMessage);
        console.error('Error adding shift:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [autoClose, closeDialog, onSuccess, onError],
  );

  return {
    open,
    isSubmitting,
    error,
    openDialog,
    closeDialog,
    handleOpenChange,
    handleAddShift,
    resetError,
  };
}

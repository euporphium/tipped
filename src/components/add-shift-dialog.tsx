'use client';

import { ReactNode } from 'react';

import { ShiftDialog } from '@/components/shift-dialog';
import { ShiftFormComponent } from '@/components/shift-form';

import { useAddShiftDialog } from '@/hooks/use-add-shift-dialog';

interface AddShiftDialogProps {
  trigger: ReactNode | ((props: { onClick: () => void }) => ReactNode);
  onSuccess?: () => void;
  onError?: (error: string) => void;
  autoClose?: boolean;
}

export function AddShiftDialog({
  trigger,
  onSuccess,
  onError,
  autoClose = true,
}: AddShiftDialogProps) {
  const {
    open,
    isSubmitting,
    error,
    openDialog,
    handleOpenChange,
    handleAddShift,
  } = useAddShiftDialog({ onSuccess, onError, autoClose });

  const renderTrigger = () => {
    if (typeof trigger === 'function') {
      return trigger({ onClick: openDialog });
    }
    return trigger;
  };

  return (
    <ShiftDialog
      trigger={renderTrigger()}
      title="Add New Shift"
      description="Enter the details for your new shift. Click save when you're done."
      open={open}
      onOpenChange={handleOpenChange}
    >
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <ShiftFormComponent
        onSubmitShift={handleAddShift}
        isSubmitting={isSubmitting}
        submitText="Save Shift"
        submittingText="Saving..."
      />
    </ShiftDialog>
  );
}

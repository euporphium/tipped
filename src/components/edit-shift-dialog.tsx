'use client';

import { ReactNode } from 'react';

import { ShiftDialog } from '@/components/shift-dialog';
import { ShiftFormComponent } from '@/components/shift-form';
import { Shift } from '@/db/schema';
import { extractTimeString } from '@/lib/validations';
import { useEditShiftDialog } from '@/hooks/use-edit-shift-dialog';

interface EditShiftDialogProps {
  shift: Shift;
  trigger: ReactNode | ((props: { onClick: () => void }) => ReactNode);
  onEditSuccess?: () => void;
}

export function EditShiftDialog({
  shift,
  trigger,
  onEditSuccess,
}: EditShiftDialogProps) {
  const {
    open,
    isSubmitting,
    error,
    openDialog,
    handleOpenChange,
    handleUpdateShift,
  } = useEditShiftDialog({
    shift,
    onSuccess: onEditSuccess,
  });

  const renderTrigger = () => {
    if (typeof trigger === 'function') {
      return trigger({ onClick: openDialog });
    }
    return trigger;
  };

  return (
    <ShiftDialog
      trigger={renderTrigger()}
      title="Edit Shift"
      description={`Update the details for your shift from ${shift.shiftStart.toLocaleDateString()}.`}
      open={open}
      onOpenChange={handleOpenChange}
    >
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <ShiftFormComponent
        initialShift={{
          shiftDate: shift.shiftStart,
          shiftStartTime: extractTimeString(shift.shiftStart),
          shiftEndTime: extractTimeString(shift.shiftEnd),
          tips: shift.tips,
        }}
        onSubmitShift={handleUpdateShift}
        isSubmitting={isSubmitting}
        submitText="Update Shift"
        submittingText="Updating..."
      />
    </ShiftDialog>
  );
}

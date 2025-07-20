import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShiftFormComponent } from './shift-form';

// Mock the date-picker component since it uses date-fns
vi.mock('./date-picker', () => ({
  DatePicker: ({
    date,
    onDateChange,
  }: {
    date: Date;
    onDateChange: (date: Date) => void;
  }) => {
    // Handle invalid dates gracefully
    const dateString = isNaN(date.getTime())
      ? ''
      : date.toISOString().split('T')[0];
    return (
      <input
        type="date"
        value={dateString}
        onChange={(e) => onDateChange(new Date(e.target.value))}
        data-testid="date-picker"
      />
    );
  },
}));

describe('ShiftFormComponent', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    expect(screen.getByText(/shift date/i)).toBeInTheDocument();
    expect(screen.getByText(/start time/i)).toBeInTheDocument();
    expect(screen.getByText(/end time/i)).toBeInTheDocument();
    expect(screen.getByText(/tips earned/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save shift/i }),
    ).toBeInTheDocument();
  });

  it('submits form with valid data including tips', async () => {
    const user = userEvent.setup();
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    // Fill in the form
    await user.type(screen.getByLabelText(/start time/i), '10:00');
    await user.type(screen.getByLabelText(/end time/i), '18:00');
    await user.type(screen.getByLabelText(/tips earned/i), '150');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /save shift/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tips: 150,
        }),
      );
    });
  });

  it('handles empty tips field', async () => {
    const user = userEvent.setup();
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    // Fill in the form without tips
    await user.type(screen.getByLabelText(/start time/i), '09:00');
    await user.type(screen.getByLabelText(/end time/i), '17:00');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /save shift/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tips: 0,
        }),
      );
    });
  });

  it('populates form with initial values for editing', () => {
    const initialShift = {
      shiftDate: new Date('2024-01-15'),
      shiftStartTime: '10:00',
      shiftEndTime: '18:00',
      tips: 200,
    };

    render(
      <ShiftFormComponent
        initialShift={initialShift}
        onSubmitShift={mockOnSubmit}
        submitText="Update Shift"
      />,
    );

    expect(screen.getByDisplayValue('10:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('18:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /update shift/i }),
    ).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(
      <ShiftFormComponent
        onSubmitShift={mockOnSubmit}
        isSubmitting={true}
        submittingText="Saving..."
      />,
    );

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it('submits with default values when no input provided', async () => {
    const user = userEvent.setup();
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    // Submit the form without filling any fields
    await user.click(screen.getByRole('button', { name: /save shift/i }));

    // The form should submit with default values
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tips: 0,
        }),
      );
    });
  });

  it('restricts tips input to integers', () => {
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    const tipsInput = screen.getByDisplayValue('');

    // Check that the input has the correct attributes for integer-only input
    expect(tipsInput).toHaveAttribute('type', 'number');
    expect(tipsInput).toHaveAttribute('step', '1');
    expect(tipsInput).toHaveAttribute('min', '0');
    expect(tipsInput).toHaveAttribute('inputMode', 'numeric');
    expect(tipsInput).toHaveAttribute('pattern', '[0-9]*');
  });

  it('validates tips input and prevents negative values', async () => {
    const user = userEvent.setup();
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    // Try to submit with negative tips
    await user.type(screen.getByLabelText(/tips earned/i), '-50');

    // Fill in other required fields to ensure form submission
    await user.type(screen.getByLabelText(/start time/i), '10:00');
    await user.type(screen.getByLabelText(/end time/i), '18:00');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /save shift/i }));

    // The form should not submit due to validation error for negative tips
    // The validation schema requires tips to be >= 0
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles date picker changes', async () => {
    const user = userEvent.setup();
    render(<ShiftFormComponent onSubmitShift={mockOnSubmit} />);

    // Change the date via the mocked date picker
    const dateInput = screen.getByTestId('date-picker');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-02-15');

    // Fill in other required fields
    await user.type(screen.getByLabelText(/start time/i), '10:00');
    await user.type(screen.getByLabelText(/end time/i), '18:00');
    await user.type(screen.getByLabelText(/tips earned/i), '200');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /save shift/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tips: 200,
        }),
      );
    });
  });

  it('renders custom submit and loading text', () => {
    render(
      <ShiftFormComponent
        onSubmitShift={mockOnSubmit}
        submitText="Custom Submit"
        submittingText="Custom Loading..."
        isSubmitting={false}
      />,
    );

    expect(
      screen.getByRole('button', { name: /custom submit/i }),
    ).toBeInTheDocument();
  });

  it('renders custom loading text when submitting', () => {
    render(
      <ShiftFormComponent
        onSubmitShift={mockOnSubmit}
        submitText="Custom Submit"
        submittingText="Custom Loading..."
        isSubmitting={true}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: /custom loading/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});

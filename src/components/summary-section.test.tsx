import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SummarySection from './summary-section';

describe('SummarySection', () => {
  it('renders summary information correctly', () => {
    const summary = {
      totalTips: 1250,
      totalShifts: 15,
      firstShift: new Date('2024-01-01'),
      lastShift: new Date('2024-01-31'),
    };

    render(<SummarySection summary={summary} />);

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('$1250')).toBeInTheDocument();
    expect(screen.getByText(/In 15 shifts from/)).toBeInTheDocument();
  });

  it('handles single shift correctly', () => {
    const summary = {
      totalTips: 100,
      totalShifts: 1,
      firstShift: new Date('2024-01-15'),
      lastShift: new Date('2024-01-15'),
    };

    render(<SummarySection summary={summary} />);

    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText(/In 1 shift on/)).toBeInTheDocument();
  });

  it('handles no shifts correctly', () => {
    const summary = {
      totalTips: 0,
      totalShifts: 0,
      firstShift: null,
      lastShift: null,
    };

    render(<SummarySection summary={summary} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(
      screen.getByText('Add a shift to get started with tip tracking.'),
    ).toBeInTheDocument();
  });

  it('handles missing date range correctly', () => {
    const summary = {
      totalTips: 500,
      totalShifts: 5,
      firstShift: null,
      lastShift: null,
    };

    render(<SummarySection summary={summary} />);

    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('In 5 shifts')).toBeInTheDocument();
  });
});

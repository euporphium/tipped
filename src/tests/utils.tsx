import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper function to create mock shifts for testing
export const createMockShift = (overrides: Partial<any> = {}) => ({
  id: 1,
  shiftStart: new Date('2024-01-15T09:00:00.000Z'),
  shiftEnd: new Date('2024-01-15T17:00:00.000Z'),
  tips: 150,
  ...overrides,
});

// Helper function to create mock shifts array
export const createMockShifts = (count: number = 3) => {
  return Array.from({ length: count }, (_, index) =>
    createMockShift({
      id: index + 1,
      shiftStart: new Date(`2024-01-${15 + index}T09:00:00.000Z`),
      shiftEnd: new Date(`2024-01-${15 + index}T17:00:00.000Z`),
      tips: 100 + index * 25,
    }),
  );
};

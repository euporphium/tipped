# Testing Setup

This project uses a modern React testing environment with the following tools:

- **Vitest** - Fast unit test runner
- **React Testing Library** - Testing utilities for React components
- **MSW (Mock Service Worker)** - API mocking for integration tests
- **jsdom** - DOM environment for testing
- **@testing-library/jest-dom** - Custom matchers for assertions

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui
```

### Current Test Status

✅ **15/15 tests passing** - The testing environment is working perfectly!

- `summary-card.test.tsx` - 4/4 tests passing
- `shift-form.test.tsx` - 11/11 tests passing

All tests are passing and the testing infrastructure is functioning correctly.

## Test Structure

- `src/tests/setup.ts` - Global test setup and configuration
- `src/tests/handlers.ts` - MSW handlers for API mocking
- `src/tests/server.ts` - MSW server setup
- `src/tests/utils.tsx` - Common testing utilities and helpers
- `src/components/*.test.tsx` - Component test files (adjacent to components)

### Test File Organization

Test files are placed adjacent to their corresponding components using the `.test.tsx` naming convention:

```
src/components/
├── summary-card.tsx
├── summary-card.test.tsx
├── shift-form.tsx
├── shift-form.test.tsx
└── ...
```

This approach:

- Keeps tests close to the code they're testing
- Makes it easy to find tests for specific components
- Follows common React testing conventions
- Simplifies imports (relative imports like `./component-name`)

## Writing Tests

### Component Tests

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<MyComponent onClick={mockOnClick} />);

    await user.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
```

### API Testing with MSW

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/server';
import { MyComponent } from '../my-component';

describe('MyComponent with API', () => {
  it('fetches and displays data', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/data', () => {
        return HttpResponse.json({ items: ['item1', 'item2'] });
      }),
    );

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText('item1')).toBeInTheDocument();
    });
  });
});
```

### Form Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MyForm } from '../my-form';

describe('MyForm', () => {
  it('submits form data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();

    render(<MyForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John' });
    });
  });
});
```

## Testing Utilities

Use the utilities from `src/tests/utils.tsx` for common testing patterns:

```tsx
import { render, createMockShift } from '@/tests/utils';

describe('ShiftComponent', () => {
  it('renders shift data', () => {
    const mockShift = createMockShift({ tips: 200 });
    render(<ShiftComponent shift={mockShift} />);

    expect(screen.getByText('$200')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the user sees and does
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test accessibility** - Ensure components are accessible by default
4. **Mock external dependencies** - Use MSW for API calls, mock complex libraries
5. **Keep tests simple** - Each test should have a single responsibility
6. **Use descriptive test names** - Make it clear what each test is verifying

## Configuration Files

- `vite.config.ts` - Vite configuration with Vitest setup
- `tsconfig.json` - TypeScript configuration with testing types
- `package.json` - Test scripts and dependencies

## Recent Test Improvements

Based on feedback, the following additional tests were added to strengthen coverage:

### `shift-form.test.tsx` - New Tests Added:

- **Validation Error Handling**: Tests that negative tips values are properly rejected by form validation
- **Date Picker Functionality**: Verifies that date changes via the date picker are handled correctly
- **Custom Text Props**: Tests that custom submit and loading text are rendered properly
- **Input Restrictions**: Validates that tips input is properly restricted to integers only
- **Redundant Test Cleanup**: Merged similar tests to eliminate redundancy and improve clarity

### Test Quality Improvements:

- **Better Selectors**: Switched from `getByDisplayValue` to `getByLabelText` for more reliable element selection
- **Robust Date Handling**: Added graceful handling of invalid dates in the DatePicker mock
- **Validation Testing**: Added proper tests for form validation behavior
- **Edge Case Coverage**: Enhanced coverage of edge cases like negative values and invalid inputs

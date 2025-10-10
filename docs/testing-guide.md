# Testing Guide - Medical Abbreviations Feature

**Version:** 1.0
**Last Updated:** October 2025
**Testing Framework:** Vitest + React Testing Library

---

## Table of Contents

1. [Testing Infrastructure](#testing-infrastructure)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Test Coverage](#test-coverage)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Testing Infrastructure

### Installed Dependencies

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "@vitest/coverage-v8": "^3.2.4",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^27.0.0"
  }
}
```

### Configuration Files

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### `src/test/setup.ts`
Configures test environment:
- Extends `expect` with jest-dom matchers
- Cleans up after each test
- Mocks browser APIs (matchMedia, IntersectionObserver, ResizeObserver)

#### `src/test/utils.tsx`
Custom render function with providers:
- React Router (BrowserRouter)
- React Query (QueryClientProvider)
- Proper TypeScript types

#### `src/test/mockData.ts`
Mock abbreviations for testing:
- 5 test abbreviations covering all scenarios
- Includes safe, caution, and prohibited examples
- Mock statistics object

---

## Running Tests

### Available Commands

```bash
# Run tests in watch mode (default)
npm test

# Run tests once and exit
npm test -- --run

# Run tests with UI interface
npm test:ui

# Generate coverage report
npm test:coverage

# Run specific test file
npm test -- AbbreviationCard

# Run tests matching pattern
npm test -- --grep "Search"

# Run tests with verbose output
npm test -- --reporter=verbose
```

### Test Execution

1. **Watch Mode** (Development):
   ```bash
   npm test
   ```
   - Automatically reruns tests when files change
   - Interactive CLI for filtering tests
   - Fast feedback loop

2. **CI Mode** (Continuous Integration):
   ```bash
   npm test -- --run
   ```
   - Runs all tests once
   - Exits with code 0 (pass) or 1 (fail)
   - Use in GitHub Actions, GitLab CI, etc.

3. **UI Mode** (Visual Debugging):
   ```bash
   npm test:ui
   ```
   - Opens browser interface at `http://localhost:51204/__vitest__/`
   - Visual test explorer
   - View test results, coverage, and errors
   - Rerun individual tests

4. **Coverage** (Quality Metrics):
   ```bash
   npm test:coverage
   ```
   - Generates HTML report in `coverage/` directory
   - Shows line, branch, function, and statement coverage
   - Highlights uncovered code

---

## Test Structure

### File Organization

```
src/
├── pages/
│   ├── MedicalAbbreviationsV2.tsx
│   └── __tests__/
│       └── MedicalAbbreviationsV2.test.tsx
├── components/
│   └── medical/
│       ├── AbbreviationCard.tsx
│       ├── AbbreviationList.tsx
│       ├── AbbreviationDetailModal.tsx
│       ├── SearchFilters.tsx
│       └── __tests__/
│           ├── AbbreviationCard.test.tsx
│           ├── AbbreviationList.test.tsx
│           ├── AbbreviationDetailModal.test.tsx
│           └── SearchFilters.test.tsx
├── data/
│   └── medicalAbbreviationsDatabase.ts
└── test/
    ├── setup.ts          # Global test setup
    ├── utils.tsx         # Custom render with providers
    └── mockData.ts       # Mock abbreviations data
```

### Test File Naming Convention

- **Unit tests**: `ComponentName.test.tsx`
- **Integration tests**: `Feature.integration.test.tsx`
- **Location**: `__tests__/` folder next to component

---

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Component from '../Component';

describe('ComponentName', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Arrange
      render(<Component prop="value" />);

      // Act
      const element = screen.getByText('Expected Text');

      // Assert
      expect(element).toBeInTheDocument();
    });
  });
});
```

### Using Custom Render

```typescript
import { render } from '@/test/utils'; // Uses custom render with providers

// Automatically includes:
// - BrowserRouter
// - QueryClientProvider
// - Proper TypeScript types

render(<MyComponent />);
```

### User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();

  render(<SearchInput />);

  const input = screen.getByPlaceholderText('Search...');

  // Type into input
  await user.type(input, 'MI');

  // Click button
  const button = screen.getByRole('button');
  await user.click(button);

  // Keyboard navigation
  await user.tab();
  await user.keyboard('{Enter}');
});
```

### Async Testing

```typescript
import { waitFor } from '@/test/utils';

it('should load data', async () => {
  render(<AsyncComponent />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.getByText('Data Loaded')).toBeInTheDocument();
  });

  // With timeout
  await waitFor(() => {
    expect(screen.getByText('Delayed Data')).toBeInTheDocument();
  }, { timeout: 3000 });
});
```

### Mocking

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('@/data/medicalAbbreviationsDatabase', () => ({
  medicalAbbreviationsDatabase: mockAbbreviations,
  calculateAbbreviationStats: vi.fn(() => mockStats),
}));

// Mock function
const mockOnClick = vi.fn();

// Mock implementation
const mockFetch = vi.fn().mockResolvedValue({ data: [] });

// Spy on method
const spy = vi.spyOn(object, 'method');
```

### Testing Library Queries

#### Priority Order (Best to Worst):

1. **getByRole**: Most accessible
   ```typescript
   screen.getByRole('button', { name: /submit/i });
   screen.getByRole('textbox', { name: /search/i });
   ```

2. **getByLabelText**: For form fields
   ```typescript
   screen.getByLabelText('Email address');
   ```

3. **getByPlaceholderText**: For inputs
   ```typescript
   screen.getByPlaceholderText('Search abbreviations...');
   ```

4. **getByText**: For non-interactive text
   ```typescript
   screen.getByText('Medical Abbreviations');
   screen.getByText(/search results/i); // Regex for case-insensitive
   ```

5. **getByTestId**: Last resort
   ```typescript
   screen.getByTestId('custom-component');
   ```

#### Query Variants:

- **getBy**: Throws error if not found (single element expected)
- **queryBy**: Returns null if not found (check absence)
- **findBy**: Returns Promise (async, waits for element)
- **getAllBy**: Returns array (multiple elements)
- **queryAllBy**: Returns empty array if none found
- **findAllBy**: Returns Promise<array>

---

## Test Coverage

### Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80%+ | TBD |
| Branches | 80%+ | TBD |
| Functions | 80%+ | TBD |
| Lines | 80%+ | TBD |

### What to Test

#### ✅ DO Test:

1. **User Interactions**
   - Click handlers work
   - Form submissions
   - Keyboard navigation
   - Touch events on mobile

2. **Conditional Rendering**
   - Loading states
   - Error states
   - Empty states
   - Conditional content

3. **Prop Behavior**
   - Component renders with props
   - Prop changes update UI
   - Default props work

4. **Accessibility**
   - ARIA labels present
   - Keyboard navigable
   - Screen reader friendly
   - Focus management

5. **Integration Points**
   - API calls (mocked)
   - Router navigation
   - State management
   - Context usage

#### ❌ DON'T Test:

1. **Implementation Details**
   - Internal state variable names
   - Component lifecycle methods
   - Private functions

2. **Third-Party Libraries**
   - React Router behavior
   - React Query caching
   - Radix UI internals

3. **Styling**
   - Exact CSS values
   - Visual appearance
   - (Use visual regression tools instead)

4. **Trivial Code**
   - Simple getters/setters
   - Pass-through components
   - Constant values

---

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ BAD: Testing implementation details
expect(component.state.count).toBe(5);

// ✅ GOOD: Testing user-visible behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

### 2. Use Descriptive Test Names

```typescript
// ❌ BAD
it('test 1', () => { ... });

// ✅ GOOD
it('should display error message when search fails', () => { ... });
```

### 3. Follow AAA Pattern

```typescript
it('should filter results by region', async () => {
  // Arrange - Setup test
  const user = userEvent.setup();
  render(<Component />);

  // Act - Perform action
  const select = screen.getByLabelText('Region');
  await user.selectOptions(select, 'US');

  // Assert - Verify outcome
  expect(screen.getByText('US Results')).toBeInTheDocument();
});
```

### 4. Keep Tests Independent

```typescript
// ❌ BAD: Tests depend on each other
let sharedState = {};

it('test 1', () => {
  sharedState.user = { name: 'John' };
});

it('test 2', () => {
  expect(sharedState.user.name).toBe('John'); // Fails if test 1 skipped
});

// ✅ GOOD: Each test is independent
it('test 1', () => {
  const user = { name: 'John' };
  expect(user.name).toBe('John');
});

it('test 2', () => {
  const user = { name: 'Jane' };
  expect(user.name).toBe('Jane');
});
```

### 5. Use Setup/Teardown Appropriately

```typescript
describe('Component', () => {
  beforeEach(() => {
    // Runs before EACH test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Runs after EACH test
    cleanup(); // Already done by setup.ts
  });

  beforeAll(() => {
    // Runs once before ALL tests
    // Setup expensive resources
  });

  afterAll(() => {
    // Runs once after ALL tests
    // Cleanup expensive resources
  });
});
```

### 6. Mock External Dependencies

```typescript
// Mock API calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
  },
}));

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
```

### 7. Test Accessibility

```typescript
it('should be keyboard navigable', async () => {
  const user = userEvent.setup();
  render(<Component />);

  // Tab through elements
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();

  // Activate with keyboard
  await user.keyboard('{Enter}');
  expect(mockOnClick).toHaveBeenCalled();
});

it('should have proper ARIA labels', () => {
  render(<Component />);

  const searchInput = screen.getByLabelText('Search medical abbreviations');
  expect(searchInput).toBeInTheDocument();
});
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module '@/...'"

**Problem**: Path alias not working

**Solution**: Check `vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

#### 2. "window.matchMedia is not a function"

**Problem**: Browser API not mocked

**Solution**: Already handled in `src/test/setup.ts`. If still occurring, verify setup file is loaded:
```typescript
// vitest.config.ts
test: {
  setupFiles: './src/test/setup.ts',
}
```

#### 3. "Unable to find role='button'"

**Problem**: Element not rendering or wrong query

**Solution**:
```typescript
// Debug what's rendered
screen.debug();

// Use more flexible query
screen.getByText('Button Text');

// Check if element exists but isn't a button
screen.getByRole('button', { name: /submit/i, hidden: true });
```

#### 4. "Received: <RED>number</RED> Expected: <GREEN>number</GREEN>"

**Problem**: Type mismatch or wrong matcher

**Solution**:
```typescript
// Use correct matcher
expect(count).toBe(5); // Strict equality
expect(obj).toEqual({ name: 'John' }); // Deep equality
expect(text).toMatch(/pattern/); // Regex
```

#### 5. "Timeout: async action not completed"

**Problem**: Async operation taking too long

**Solution**:
```typescript
// Increase timeout
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });

// Or check if element loads at all
const element = await screen.findByText('Loaded', {}, { timeout: 5000 });
```

#### 6. "Test suite failed to run"

**Problem**: Syntax error or import issue

**Solution**:
```bash
# Check for TypeScript errors
npm run build

# Run single test file for details
npm test -- ComponentName.test.tsx --reporter=verbose
```

#### 7. "Multiple elements found"

**Problem**: Query returns multiple matches

**Solution**:
```typescript
// Use getAllBy
const buttons = screen.getAllByRole('button');
expect(buttons).toHaveLength(3);

// Or be more specific
screen.getByRole('button', { name: /submit/i });

// Or use within
const form = screen.getByRole('form');
within(form).getByRole('button');
```

### Debugging Tests

#### 1. Print rendered output:
```typescript
screen.debug(); // Prints entire DOM
screen.debug(screen.getByRole('button')); // Prints specific element
```

#### 2. Use Vitest UI:
```bash
npm test:ui
```
- Visual test explorer
- See rendered output
- Inspect element queries

#### 3. Use console.log:
```typescript
console.log('Query result:', screen.queryByText('Text'));
console.log('Props:', props);
```

#### 4. Run single test:
```bash
npm test -- --grep "specific test name"
```

#### 5. Check test coverage:
```bash
npm test:coverage
# Open coverage/index.html in browser
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Generate coverage
        run: npm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Additional Resources

- **Vitest Docs**: [https://vitest.dev/](https://vitest.dev/)
- **Testing Library**: [https://testing-library.com/react](https://testing-library.com/react)
- **User Event**: [https://testing-library.com/docs/user-event/intro](https://testing-library.com/docs/user-event/intro)
- **jest-dom Matchers**: [https://github.com/testing-library/jest-dom](https://github.com/testing-library/jest-dom)

---

## Test Coverage Report

Run `npm test:coverage` to generate report.

**Example Output**:
```
File                                 | % Stmts | % Branch | % Funcs | % Lines
-------------------------------------|---------|----------|---------|--------
MedicalAbbreviationsV2.tsx          |   85.2  |   78.5   |   90.0  |   85.2
AbbreviationCard.tsx                |   92.3  |   85.7   |   95.0  |   92.3
AbbreviationList.tsx                |   88.9  |   80.0   |   87.5  |   88.9
AbbreviationDetailModal.tsx         |   90.5  |   83.3   |   92.0  |   90.5
SearchFilters.tsx                   |   87.6  |   81.2   |   89.0  |   87.6
-------------------------------------|---------|----------|---------|--------
All files                           |   88.9  |   81.7   |   90.7  |   88.9
```

---

**Document Version**: 1.0
**Last Updated**: October 2025
**Maintained By**: Development Team

# Playwright TypeScript Automation Setup

A modern TypeScript Playwright project with ESLint (flat config), Prettier, and Playwright
plugin support.

## Setup

Install dependencies:

```bash
npm install
```

## Scripts

- `npm test` - Run Playwright tests
- `npm run test:ui` - Run tests with UI mode
- `npm run test:headed` - Run tests in headed mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without modifying
- `npm run type-check` - Run TypeScript compiler

## Project Structure

```
.
├── tests/                    # Playwright test files
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration (flat config)
├── prettier.config.mjs       # Prettier configuration
├── .prettierignore           # Prettier ignore patterns
└── package.json              # Project dependencies and scripts
```

## Configuration Details

### ESLint (Modern Flat Config)

- **Format**: ESLint flat config (`eslint.config.mjs`) - modern standard
- **TypeScript Support**: Full type-aware linting with `typescript-eslint`
- **Playwright Plugin**: Catches Playwright-specific issues
- **Stylistic Plugin**: Code style enforcement
- **Key Rules**:
    - Floating promise detection (critical for async tests)
    - Thenable/await validation
    - No unused variables (ignoring `_` parameters)
    - Playwright-specific rules (no useless assertions)
    - Stylistic rules (semicolons, quotes, spacing)

### Prettier (Modern Format)

- **Format**: JavaScript config (`prettier.config.mjs`) - modern standard
- **2 space indentation**
- **Single quotes**
- **100 character line width**
- **Trailing commas** (ES5 compatible)
- **Arrow parentheses** (always)

### Playwright

- **Multi-browser**: Chrome, Firefox, Safari
- **Reporting**: HTML test report
- **Failure Handling**: Screenshots on failure, traces on retry
- **Type Safety**: Full TypeScript support

## Usage

Create test files in the `tests/` directory with `.spec.ts` extension.

Example:

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
    await page.goto('http://example.com');
    await expect(page).toHaveTitle(/Example/);
});
```

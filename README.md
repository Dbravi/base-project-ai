# AI Automation Setup

Playwright test suite for E2E testing with TypeScript, ESLint, and Prettier.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Running Tests

```bash
# Headless mode
npm test

# UI mode
npm run test:ui

# Headed mode (browser visible)
npm run test:headed
```

### Linting & Formatting

```bash
# Check TypeScript
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Fix all issues
npm run fix
```

## Project Structure

```
.
├── .github/workflows/     # CI/CD workflows
├── .claude/              # Claude Code configuration
├── eslint.config.mjs     # ESLint configuration (v9+ flat config)
├── prettier.config.mjs   # Prettier configuration
├── tsconfig.json         # TypeScript configuration
├── playwright.config.ts  # Playwright configuration
├── tests/                # Test files
└── package.json          # Project metadata
```

## Configuration

### ESLint

- Flat config format (v9+)
- TypeScript strict rules
- Playwright best practices
- Stylistic rules (4-space indent, single quotes, semicolons)

### Prettier

- 4-space indent
- Single quotes
- Trailing commas
- Print width: 120

### TypeScript

- Strict mode enabled
- Target: ES2020
- Module: esnext (ESM)

### Playwright

- Chrome browser
- Parallel test execution
- HTML reporting
- Screenshot on failure
- Trace on retry

## CI/CD

Tests run automatically on:

- Push to `main` branch
- All pull requests

View results in GitHub Actions. Test reports stored as artifacts.

## Best Practices

- Write tests in `tests/` directory
- Use `.test.ts` or `.spec.ts` extensions
- Follow Page Object Model for complex tests
- Use Playwright's built-in waiting mechanisms
- No hard-coded timeouts

## License

ISC

# AI Automation Setup

Playwright test suite. TypeScript strict mode. ESLint + Prettier auto-format via PostToolUse hook.

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Tests:** Playwright Test (`@playwright/test`)
- **Lang:** TypeScript ES2020 (strict)
- **Lint/Format:** ESLint + Prettier (auto via hook)

## Project Layout

```
tests/          # Playwright test files (*.ts)
playwright.config.ts
tsconfig.json
```

## Scripts

```bash
npm test              # Run tests
npm run test:ui       # UI mode
npm run test:headed   # Headed mode
npm run fix           # ESLint + Prettier (auto via hook)
npm run type-check    # tsc validation
```

## Conventions

- TS strict=true. No `any` types.
- File: `*.test.ts` or `*.spec.ts`
- Test path: `tests/**/*.ts`
- Lint on save via hook. Manual: `npm run lint:fix`
- Prettier on save via hook. Manual: `npm run format`

## Code Guidelines

- Page Object Model for complex tests
- Avoid hard-coded timeouts; use Playwright's waits
- Test isolation: fresh browser context per test
- Use `test.describe()` for test grouping
- Comment only non-obvious setup or workarounds

## Build Output

`dist/` (gitignored). Source maps enabled.

## Notes

- PostToolUse hook runs `npm run fix` after most tool uses
- `.gitattributes` enforces LF line endings (Windows-safe)

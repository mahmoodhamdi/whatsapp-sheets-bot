# Testing Notes

Status of the test suite after the 2026-05-12 sales-readiness pass.

## Unit + Integration

- **Total**: 298 tests across 18 files, all passing.
- **Run time**: ~800ms for unit, ~250ms for integration.
- **New this branch**: `tests/unit/whatsapp-adapter.test.ts` (9 tests covering the new adapter abstraction).

## E2E (Playwright)

- **Total spec files**: 19 (under `tests/e2e/`)
- **Local run status**: **deferred to CI** — Playwright 1.57 does not bundle a Chromium build for Ubuntu 26.04 (the dev host). `npx playwright install chromium` fails with `Playwright does not support chromium on ubuntu26.04-x64`.
- **CI status**: GitHub Actions runners use Ubuntu 22.04, which is supported. E2E runs there as part of the standard pipeline.

This is a known Playwright limitation on bleeding-edge Linux distros. The spec files themselves are unchanged from `master` and have been verified to compile under TypeScript.

## Coverage

Coverage measurement is configured via `@vitest/coverage-v8` which is already a dev dependency. To run:

```bash
npx vitest run --coverage
```

Coverage thresholds were not enforced in this branch. Recommended next steps:

1. Add `coverage` block to `vitest.config.ts` with thresholds:
   ```ts
   coverage: {
     provider: "v8",
     thresholds: { statements: 80, branches: 70, functions: 80, lines: 80 },
     exclude: [
       "src/generated/**",
       "sentry.*.config.ts",
       "instrumentation.ts",
       "src/lib/whatsapp/client.ts", // Baileys integration, covered via e2e
     ],
   }
   ```
2. Wire into CI: fail the pipeline if any threshold drops.
3. Iteratively raise thresholds as coverage improves.

The brief specified 95% targets; current realistic baseline (estimated): 70-80% across statements. Reaching 95% requires:
- Mock harness for Baileys WhatsApp client (significant)
- Integration tests against real Stripe via stripe-mock (planned, see DECISIONS Phase 3 entry)
- Tests for several less-exercised API routes

## Test Strategy by Layer

| Layer | Tool | Coverage |
|---|---|---|
| Pure functions (matchers, validators, utils) | Vitest | High — straightforward |
| API routes (request/response shape) | Vitest with mocked Prisma | Medium |
| DB interactions | Integration tests with seed DB | Medium |
| External services (Stripe, Sheets, Resend) | Mocks at module boundary | Low — relies on shape contracts |
| WhatsApp Baileys | Mock adapter (this branch) + e2e | Adapter unit-tested; full path via e2e in CI |
| UI flows | Playwright | All major flows covered |

## Known Skipped/Pending Tests

None currently. The test suite has no `.skip` or `.only` flags.

## Failed Test Recovery Process

If CI tests fail:
1. Reproduce locally with the same Node version (`20.x`)
2. Check `npm ci` against the locked `package-lock.json` — no `npm install` after the fact
3. Verify the Postgres test fixture is migrated and seeded
4. For Playwright: ensure browser cache matches CI (`npx playwright install --with-deps`)

## Adding New Tests

Conventions:
- Unit tests: co-located by domain, e.g. `tests/unit/<domain>.test.ts`
- Integration: `tests/integration/<flow>.test.ts`
- E2E: `tests/e2e/<feature>.spec.ts` using the existing fixtures in `tests/e2e/fixtures/`
- Always use `@/` import aliases
- Mock external services at the boundary, never partial-mock internal modules

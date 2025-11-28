# Dependencies and Resources

## Required Software

**Node.js v18+** -(https://nodejs.org/)

Verify installation:
```bash
node --version    # Should be v18.0.0+
npm --version
```

## Project Dependencies

Defined in `package.json`, installed via `npm install`:

**Core:**
- `@playwright/test` (^1.40.0) - Test framework
- `typescript` (^5.3.2) - Type safety
- `@types/node` (^20.10.0) - Node.js types

**Reporting:**
- `allure-playwright` (^2.15.1) - Allure integration
- `allure-commandline` (^2.25.0) - Report generation

## Browser Installation

```bash
npx playwright install              # All browsers
npx playwright install --with-deps  # With system dependencies
```

**Browsers:** Chromium, Firefox, WebKit 

## System Requirements

**Minimum:**
- OS: macOS 11+ / Windows 10+ / Ubuntu 20.04+
- RAM: 4 GB
- Disk: 1 GB free
- Internet: Required for testing

**Recommended:**
- RAM: 8+ GB
- Disk: 5 GB free
- CPU: 4+ cores

## Configuration Files

- `package.json` - Dependencies and scripts
- `playwright.config.ts` - Playwright settings
- `tsconfig.json` - TypeScript settings
- 
## Resources

- Playwright: https://playwright.dev/
- TypeScript: https://www.typescriptlang.org/
- Allure: https://docs.qameta.io/allure/

**Framework Version:** 1.0.0

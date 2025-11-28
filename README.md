# Sauce Demo Test Automation Suite

Automated test suite for [Sauce Labs Demo](https://www.saucedemo.com) using Playwright and TypeScript.

## Prerequisites

- Node.js v18+ (https://nodejs.org/))
- npm (included with Node.js)

## Installation

```bash
cd TestSauceDemoRepo
npm install
npx playwright install
```

## Running Tests

```bash
npm test                    # Run all tests
npm run test:headed         # Run with visible browser
npm run test:debug          # Debug mode
npm run test:ui             # Interactive mode
npm run test:report         # View HTML report
```

## Test Coverage

The suite tests complete checkout flow:
1. Login to Sauce Demo
2. Select 3 random products
3. Add to cart
4. Complete checkout with customer info
5. Verify order success

**Test Scenarios:**
- Complete checkout with 3 random items
- Alternative user data validation
- Cart state persistence verification

## Project Structure

```
├── pages/          # Page Object Models
├── tests/          # Test specifications
├── utils/          # Test data and helpers
└── types/          # TypeScript types
```

## Configuration

**Test Data** - Edit `utils/TestData.ts`:
```typescript
TestUsers.STANDARD_USER = { username: 'standard_user', password: 'secret_sauce' }
CheckoutInfo.VALID_USER = { firstName: 'John', lastName: 'Doe', postalCode: '12345' }
```

**Playwright Config** - Edit `playwright.config.ts`:
- Timeout settings
- Browser selection
- Report options

**Built with:** Playwright + TypeScript | **Version:** 1.0.0

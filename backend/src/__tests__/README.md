# Backend Tests

This directory contains automated tests for the Credit Card Debt Tracker backend.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

- `health.test.js` - Tests for health check endpoints
- `sanitize.test.js` - Tests for input sanitization middleware

## Writing New Tests

To add new tests:

1. Create a new file with `.test.js` extension in the `__tests__` directory
2. Import the necessary modules and the app
3. Write your test suites using Jest's `describe` and `it` blocks
4. Use `supertest` for API endpoint testing

### Example:

```javascript
const request = require('supertest');
const app = require('../index');

describe('My Feature', () => {
  it('should do something', async () => {
    const response = await request(app)
      .get('/api/my-endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

## Test Coverage

Run `npm test` to see test coverage reports. Aim for at least 80% coverage on critical business logic.

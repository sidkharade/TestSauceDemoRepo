/**
 * Test Data for Sauce Demo Application
 */

export const TestUsers = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  }
};

export const CheckoutInfo = {
  VALID_USER: {
    firstName: 'Siddhant',
    lastName: 'Kharade',
    postalCode: '012345'
  },
  ANOTHER_USER: {
    firstName: 'Sid',
    lastName: 'Kharade',
    postalCode: '067890'
  }
};

export const TestConfig = {
  BASE_URL: 'https://www.saucedemo.com',
  TIMEOUT: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000
  }
};


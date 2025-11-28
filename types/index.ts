/**
 * Type definitions for the test suite
 */

export interface User {
  username: string;
  password: string;
}

export interface CheckoutInformation {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  name: string;
  description: string;
  price: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
}


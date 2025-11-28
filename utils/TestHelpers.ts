/**
 * Utility helper functions for tests
 */

/**
 * Generate a random string
 * @param length - Length of the string
 */
export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate a random number within a range
 * @param min - Minimum value
 * @param max - Maximum value
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for a specified time
 * @param ms - Time in milliseconds
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format price string to number
 * @param priceString - Price string (e.g., "$29.99")
 */
export function formatPrice(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

/**
 * Get current timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Generate test report name with timestamp
 * @param baseName - Base name for the report
 */
export function generateReportName(baseName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${baseName}_${timestamp}`;
}


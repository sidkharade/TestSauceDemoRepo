import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Checkout Overview Page
 */
export class CheckoutOverviewPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly subtotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly paymentInfo: Locator;
  private readonly shippingInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.paymentInfo = page.locator('.summary_value_label').first();
    this.shippingInfo = page.locator('.summary_value_label').last();
  }

  /**
   * Verify checkout overview page is displayed
   */
  async verifyCheckoutOverviewPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
  }

  /**
   * Get number of items in overview
   */
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get all product names in overview
   */
  async getProductNames(): Promise<string[]> {
    const productNames: string[] = [];
    const count = await this.cartItems.count();
    
    for (let i = 0; i < count; i++) {
      const name = await this.cartItems.nth(i).locator('.inventory_item_name').textContent();
      if (name) {
        productNames.push(name);
      }
    }
    
    return productNames;
  }

  /**
   * Verify products in overview match expected products
   * @param expectedProducts - Array of expected product names
   */
  async verifyProductsInOverview(expectedProducts: string[]): Promise<void> {
    const actualProducts = await this.getProductNames();
    
    expect(actualProducts.length).toBe(expectedProducts.length);
    
    for (const expectedProduct of expectedProducts) {
      expect(actualProducts).toContain(expectedProduct);
    }
  }

  /**
   * Get subtotal amount
   */
  async getSubtotal(): Promise<string> {
    const text = await this.subtotal.textContent();
    return text?.replace('Item total: $', '') || '0';
  }

  /**
   * Get tax amount
   */
  async getTax(): Promise<string> {
    const text = await this.tax.textContent();
    return text?.replace('Tax: $', '') || '0';
  }

  /**
   * Get total amount
   */
  async getTotal(): Promise<string> {
    const text = await this.total.textContent();
    return text?.replace('Total: $', '') || '0';
  }

  /**
   * Verify price calculation
   */
  async verifyPriceCalculation(): Promise<void> {
    const subtotal = parseFloat(await this.getSubtotal());
    const tax = parseFloat(await this.getTax());
    const total = parseFloat(await this.getTotal());
    
    const calculatedTotal = subtotal + tax;
    
    expect(total).toBeCloseTo(calculatedTotal, 2);
  }

  /**
   * Verify payment information is displayed
   */
  async verifyPaymentInfoDisplayed(): Promise<void> {
    await expect(this.paymentInfo).toBeVisible();
  }

  /**
   * Verify shipping information is displayed
   */
  async verifyShippingInfoDisplayed(): Promise<void> {
    await expect(this.shippingInfo).toBeVisible();
  }

  /**
   * Click finish button to complete order
   */
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Click cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }
}


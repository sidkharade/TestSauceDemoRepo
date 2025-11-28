import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.finishButton = page.locator('[data-test="finish"]');
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
   * Click finish button to complete order
   */
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

}


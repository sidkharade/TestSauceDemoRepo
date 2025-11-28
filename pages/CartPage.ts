import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButton = page.locator('button').filter({ hasText: 'Remove' });
  }

  /**
   * Verify cart page is displayed
   */
  async verifyCartPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
    await expect(this.checkoutButton).toBeVisible();
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get all product names in cart
   */
  async getCartProductNames(): Promise<string[]> {
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
   * Verify products in cart match expected products
   * @param expectedProducts - Array of expected product names
   */
  async verifyProductsInCart(expectedProducts: string[]): Promise<void> {
    const actualProducts = await this.getCartProductNames();
    
    expect(actualProducts.length).toBe(expectedProducts.length);
    
    for (const expectedProduct of expectedProducts) {
      expect(actualProducts).toContain(expectedProduct);
    }
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}


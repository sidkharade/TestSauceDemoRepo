import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  /**
   * Verify products page is displayed
   */
  async verifyProductsPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * Get total number of products
   */
  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }
  /**
   * Add random products to cart
   * @param count - Number of random products to add
   * @returns Array of product names that were added
   */
  async addRandomProductsToCart(count: number): Promise<string[]> {
    const totalProducts = await this.getProductCount();
    const addedProducts: string[] = [];
    const selectedIndices: number[] = [];

    // Generate random unique indices
    while (selectedIndices.length < count) {
      const randomIndex = Math.floor(Math.random() * totalProducts);
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
      }
    }

    // Add products to cart
    for (const index of selectedIndices) {
      const productName = await this.inventoryItems.nth(index).locator('.inventory_item_name').textContent();
      await this.inventoryItems.nth(index).locator('button').filter({ hasText: 'Add to cart' }).click();
      if (productName) addedProducts.push(productName);
    }

    return addedProducts;
  }

  /**
   * Get shopping cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      const badgeText = await this.shoppingCartBadge.textContent();
      return parseInt(badgeText || '0');
    } catch {
      return 0;
    }
  }

  /**
   * Click on shopping cart
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Verify cart badge shows expected count
   * @param expectedCount - Expected number of items
   */
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.shoppingCartBadge).not.toBeVisible();
    } else {
      await expect(this.shoppingCartBadge).toHaveText(expectedCount.toString());
    }
  }
}


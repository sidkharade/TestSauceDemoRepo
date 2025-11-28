import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Products/Inventory Page
 */
export class ProductsPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly productSortDropdown: Locator;
  private readonly hamburgerMenu: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.productSortDropdown = page.locator('[data-test="product_sort_container"]');
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /**
   * Verify products page is displayed
   */
  async verifyProductsPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * Get all product names
   */
  async getAllProductNames(): Promise<string[]> {
    const productNames: string[] = [];
    const count = await this.inventoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const name = await this.inventoryItems.nth(i).locator('.inventory_item_name').textContent();
      if (name) {
        productNames.push(name);
      }
    }
    
    return productNames;
  }

  /**
   * Get total number of products
   */
  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  /**
   * Add product to cart by name
   * @param productName - Name of the product
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.locator('button').filter({ hasText: 'Add to cart' }).click();
  }

  /**
   * Add product to cart by index
   * @param index - Index of the product (0-based)
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    await this.inventoryItems.nth(index).locator('button').filter({ hasText: 'Add to cart' }).click();
  }

  /**
   * Add random products to cart
   * @param count - Number of random products to add
   * @returns Array of product names that were added
   */
  async addRandomProductsToCart(count: number): Promise<string[]> {
    const totalProducts = await this.getProductCount();
    
    if (count > totalProducts) {
      throw new Error(`Cannot add ${count} products. Only ${totalProducts} products available.`);
    }

    // Generate random unique indices
    const randomIndices = this.getRandomUniqueNumbers(0, totalProducts - 1, count);
    const addedProducts: string[] = [];

    for (const index of randomIndices) {
      const productName = await this.inventoryItems.nth(index).locator('.inventory_item_name').textContent();
      await this.addProductToCartByIndex(index);
      
      if (productName) {
        addedProducts.push(productName);
        console.log(`Added product: ${productName}`);
      }
    }

    return addedProducts;
  }

  /**
   * Generate random unique numbers within a range
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @param count - Number of unique numbers to generate
   */
  private getRandomUniqueNumbers(min: number, max: number, count: number): number[] {
    const numbers: number[] = [];
    
    while (numbers.length < count) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(random)) {
        numbers.push(random);
      }
    }
    
    return numbers;
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

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.hamburgerMenu.click();
    await this.logoutLink.click();
  }
}


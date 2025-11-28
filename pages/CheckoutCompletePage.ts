import { Page, Locator, expect } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly pageTitle: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;
  private readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('.pony_express');
  }

  /**
   * Verify checkout complete page is displayed
   */
  async verifyCheckoutCompletePageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toBeVisible();
  }

  /**
   * Verify order success message
   */
  async verifyOrderSuccessMessage(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toBeVisible();
    await expect(this.ponyExpressImage).toBeVisible();
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }


  /**
   * Click back home button
   */
  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}


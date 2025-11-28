import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { TestUsers, CheckoutInfo } from '../utils/TestData';

test.describe.serial('Sauce Demo - Complete Checkout Flow', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Complete checkout flow with 3 random items', async ({ page }) => {
    await test.step('1.Login to the application', async () => {
      await loginPage.verifyLoginPageDisplayed();
      await loginPage.login(TestUsers.STANDARD_USER.username, TestUsers.STANDARD_USER.password);
    });

await test.step('2.Add 3 random products to cart', async () => {    let addedProducts: string[] = [];
    await test.step('Add 3 random products to cart', async () => {
      await productsPage.verifyProductsPageDisplayed();
      const totalProducts = await productsPage.getProductCount();
      console.log(`Total products available: ${totalProducts}`);
      
      addedProducts = await productsPage.addRandomProductsToCart(3);
      console.log('Products added to cart:', addedProducts);
      
      await productsPage.verifyCartItemCount(3);
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    await test.step('3.Verify products in shopping cart', async () => {
      await productsPage.goToCart();
      await cartPage.verifyCartPageDisplayed();
      
      const cartItemCount = await cartPage.getCartItemCount();
      expect(cartItemCount).toBe(3);
      
      await cartPage.verifyProductsInCart(addedProducts);
      console.log('Verified products in cart');
    });

    await test.step('4.Navigate to checkout', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutPageDisplayed();
    });

    await test.step('5.Fill checkout information', async () => {
      await checkoutPage.completeCheckoutInformation(
        CheckoutInfo.VALID_USER.firstName,
        CheckoutInfo.VALID_USER.lastName,
        CheckoutInfo.VALID_USER.postalCode
      );
    });

    await test.step('6.Verify checkout overview', async () => {
      await checkoutOverviewPage.verifyCheckoutOverviewPageDisplayed();
      await checkoutOverviewPage.verifyProductsInOverview(addedProducts);
      
      const overviewItemCount = await checkoutOverviewPage.getItemCount();
      expect(overviewItemCount).toBe(3);
    });

    await test.step('7.Complete the order', async () => {
      await checkoutOverviewPage.clickFinish();
    });

    await test.step('8.Verify order completion', async () => {
      await checkoutCompletePage.verifyCheckoutCompletePageDisplayed();
      await checkoutCompletePage.verifyOrderSuccessMessage();
      
      const successMessage = await checkoutCompletePage.getSuccessMessage();
      expect(successMessage).toBe('Thank you for your order!');
      console.log('Order completed successfully!');
    });

    await test.step('9.Navigate back to products page', async () => {
      await checkoutCompletePage.clickBackHome();
      await productsPage.verifyProductsPageDisplayed();
      await productsPage.verifyCartItemCount(0);
    });
  }); 
});
});

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { TestUsers, CheckoutInfo } from '../utils/TestData';

test.describe('Sauce Demo - Complete Checkout Flow', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    // Navigate to the application
    await loginPage.navigate();
  });

  test('Complete checkout flow with 3 random items', async ({ page }) => {
    // Step 1: Login
    await test.step('Login to the application', async () => {
      await loginPage.verifyLoginPageDisplayed();
      await loginPage.login(TestUsers.STANDARD_USER.username, TestUsers.STANDARD_USER.password);
    });

    // Step 2: Verify Products Page and Add 3 Random Products
    let addedProducts: string[] = [];
    await test.step('Add 3 random products to cart', async () => {
      await productsPage.verifyProductsPageDisplayed();
      
      // Get total product count
      const totalProducts = await productsPage.getProductCount();
      console.log(`Total products available: ${totalProducts}`);
      
      // Add 3 random products to cart
      addedProducts = await productsPage.addRandomProductsToCart(3);
      console.log('Products added to cart:', addedProducts);
      
      // Verify cart badge shows 3 items
      await productsPage.verifyCartItemCount(3);
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    // Step 3: Navigate to Cart and Verify Products
    await test.step('Verify products in shopping cart', async () => {
      await productsPage.goToCart();
      await cartPage.verifyCartPageDisplayed();
      
      // Verify all 3 products are in the cart
      const cartItemCount = await cartPage.getCartItemCount();
      expect(cartItemCount).toBe(3);
      
      // Verify the correct products are in the cart
      await cartPage.verifyProductsInCart(addedProducts);
      console.log('Verified products in cart');
    });

    // Step 4: Proceed to Checkout
    await test.step('Navigate to checkout', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutPageDisplayed();
    });

    // Step 5: Fill Checkout Information
    await test.step('Fill checkout information', async () => {
      await checkoutPage.completeCheckoutInformation(
        CheckoutInfo.VALID_USER.firstName,
        CheckoutInfo.VALID_USER.lastName,
        CheckoutInfo.VALID_USER.postalCode
      );
    });

    // Step 6: Verify Checkout Overview
    await test.step('Verify checkout overview', async () => {
      await checkoutOverviewPage.verifyCheckoutOverviewPageDisplayed();
      
      // Verify products in overview
      await checkoutOverviewPage.verifyProductsInOverview(addedProducts);
      
      // Verify item count
      const overviewItemCount = await checkoutOverviewPage.getItemCount();
      expect(overviewItemCount).toBe(3);
      
      // Verify payment and shipping info are displayed
      await checkoutOverviewPage.verifyPaymentInfoDisplayed();
      await checkoutOverviewPage.verifyShippingInfoDisplayed();
      
      // Verify price calculation
      await checkoutOverviewPage.verifyPriceCalculation();
      
      // Log price details
      const subtotal = await checkoutOverviewPage.getSubtotal();
      const tax = await checkoutOverviewPage.getTax();
      const total = await checkoutOverviewPage.getTotal();
      console.log(`Order Summary - Subtotal: $${subtotal}, Tax: $${tax}, Total: $${total}`);
    });

    // Step 7: Complete the Order
    await test.step('Complete the order', async () => {
      await checkoutOverviewPage.clickFinish();
    });

    // Step 8: Verify Order Completion
    await test.step('Verify order completion', async () => {
      await checkoutCompletePage.verifyCheckoutCompletePageDisplayed();
      await checkoutCompletePage.verifyOrderSuccessMessage();
      
      const successMessage = await checkoutCompletePage.getSuccessMessage();
      expect(successMessage).toBe('Thank you for your order!');
      console.log('Order completed successfully!');
    });

    // Step 9: Return to Products Page
    await test.step('Navigate back to products page', async () => {
      await checkoutCompletePage.clickBackHome();
      await productsPage.verifyProductsPageDisplayed();
      
      // Verify cart is empty
      await productsPage.verifyCartItemCount(0);
    });
  });

  test('Complete checkout flow with 3 random items - Alternative user', async ({ page }) => {
    // Step 1: Login
    await test.step('Login to the application', async () => {
      await loginPage.login(TestUsers.STANDARD_USER.username, TestUsers.STANDARD_USER.password);
      await productsPage.verifyProductsPageDisplayed();
    });

    // Step 2: Add 3 Random Products
    let addedProducts: string[] = [];
    await test.step('Add 3 random products to cart', async () => {
      addedProducts = await productsPage.addRandomProductsToCart(3);
      await productsPage.verifyCartItemCount(3);
    });

    // Step 3: Go to Cart
    await test.step('Navigate to cart', async () => {
      await productsPage.goToCart();
      await cartPage.verifyCartPageDisplayed();
      await cartPage.verifyProductsInCart(addedProducts);
    });

    // Step 4: Checkout with Alternative User Info
    await test.step('Proceed to checkout with alternative user info', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyCheckoutPageDisplayed();
      
      // Use different checkout information
      await checkoutPage.completeCheckoutInformation(
        CheckoutInfo.ANOTHER_USER.firstName,
        CheckoutInfo.ANOTHER_USER.lastName,
        CheckoutInfo.ANOTHER_USER.postalCode
      );
    });

    // Step 5: Verify and Complete Order
    await test.step('Complete order', async () => {
      await checkoutOverviewPage.verifyCheckoutOverviewPageDisplayed();
      await checkoutOverviewPage.verifyProductsInOverview(addedProducts);
      await checkoutOverviewPage.clickFinish();
    });

    // Step 6: Verify Success
    await test.step('Verify order success', async () => {
      await checkoutCompletePage.verifyCheckoutCompletePageDisplayed();
      await checkoutCompletePage.verifyOrderSuccessMessage();
    });
  });

  test('Verify cart maintains correct state during checkout', async ({ page }) => {
    // Login
    await loginPage.login(TestUsers.STANDARD_USER.username, TestUsers.STANDARD_USER.password);
    await productsPage.verifyProductsPageDisplayed();

    // Add 3 random products
    const addedProducts = await productsPage.addRandomProductsToCart(3);
    
    // Verify cart count on products page
    const cartCountOnProductsPage = await productsPage.getCartItemCount();
    expect(cartCountOnProductsPage).toBe(3);

    // Navigate to cart
    await productsPage.goToCart();
    await cartPage.verifyCartPageDisplayed();
    
    // Verify products are maintained
    const cartProducts = await cartPage.getCartProductNames();
    expect(cartProducts.length).toBe(3);
    expect(cartProducts).toEqual(expect.arrayContaining(addedProducts));

    // Proceed through checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckoutInformation(
      CheckoutInfo.VALID_USER.firstName,
      CheckoutInfo.VALID_USER.lastName,
      CheckoutInfo.VALID_USER.postalCode
    );

    // Verify products are still maintained in overview
    const overviewProducts = await checkoutOverviewPage.getProductNames();
    expect(overviewProducts.length).toBe(3);
    expect(overviewProducts).toEqual(expect.arrayContaining(addedProducts));
  });
});


const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pet Info/);
  });

  test('should have navigation for all pet sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for pet section links
    await expect(page.locator('a[href*="dog"]')).toBeVisible();
    await expect(page.locator('a[href*="cat"]')).toBeVisible();
    await expect(page.locator('a[href*="rabbit"]')).toBeVisible();
    await expect(page.locator('a[href*="fish"]')).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check for search boxes
    await expect(page.locator('input[type="search"]')).toHaveCount(2);
  });
});
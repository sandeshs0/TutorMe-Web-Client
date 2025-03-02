import { test, expect } from '@playwright/test';

const mockTutor = {
  name: 'John Doe',
  profileImage: 'https://via.placeholder.com/40',
};

test.describe('Tutor Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'harveys@pearson.com');
    await page.fill('input[name="password"]', 'newpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5173/tutor-dashboard');
  });

  test('should render the Tutor Dashboard correctly', async ({ page }) => {
    await expect(page.getByText(`Hi, Harvey Specter !`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    const darkModeButton = page.locator('button[aria-label="Toggle Dark Mode"]');
    await darkModeButton.click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
    await darkModeButton.click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
  });

  test('should navigate between different sections', async ({ page }) => {
    await page.getByRole('button', { name: 'Session Requests' }).click();
    await expect(page.getByTestId('session-requests-container')).toBeVisible(); 
      await page.getByRole('button', { name: 'Profile' }).click();
    await expect(page.getByTestId('tutor-profile-container')).toBeVisible(); 
  });

  test('should open and close notifications', async ({ page }) => {
    const notificationButton = page.locator('button:has(i.fa-bell)');
    await notificationButton.click();
    await page.waitForSelector('.notifications-dropdown');
    await expect(page.getByTestId('notifications')).toBeVisible();
    await notificationButton.click();
    await expect(page.getByText('Notifications')).not.toBeVisible();
  });

  test('should open and close the sidebar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); 
    const sidebarButton = page.locator('button[aria-label="Toggle Sidebar"]');
    await sidebarButton.click();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
  });
});

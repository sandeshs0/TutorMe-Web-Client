 import { test, expect } from '@playwright/test';

test.describe('BrowseTutorsPage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/browse');
  });

  test('should display loading skeletons initially', async ({ page }) => {
    const skeletons = await page.locator('.react-loading-skeleton');
    await expect(skeletons).toHaveCount(6); 
  });

  test('should display tutors after loading', async ({ page }) => {
    await page.waitForSelector('.grid > div, .flex.flex-col > div', { state: 'visible' });
 
    const tutorCards = await page.locator('[data-testid="tutor-card"]'); 
    await expect(tutorCards).toHaveCount(6);
  });

  test('should filter tutors by search query', async ({ page }) => {
    await page.waitForSelector('.grid > div, .flex.flex-col > div');

    await page.fill('input[placeholder="Search tutors..."]', 'Math');
    await page.waitForTimeout(1000); 
    const tutorCards = await page.locator('[data-testid="tutor-card"]');
    await expect(tutorCards).toHaveCountGreaterThan(0);
  });

  test('should filter tutors by subject', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('button:has(svg[data-icon="FaFilter"])').click();
    await page.locator('button:text("Math")').click();
    await expect(page.locator('.badge:text("Math")')).toBeVisible();

    await page.waitForTimeout(1000);

    const tutorCards = await page.locator('[data-testid="tutor-card"]');
    await expect(tutorCards).toHaveCountGreaterThan(0);

    await page.locator('.badge:text("Math") svg[data-icon="FaTimes"]').click();
    await expect(page.locator('.badge:text("Math")')).not.toBeVisible();
  });

  test('should filter tutors by price range', async ({ page }) => {
    // Open filters on mobile view (if applicable)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('button:has(svg[data-icon="FaFilter"])').click();

    // Adjust price range slider
    await page.locator('input[type="range"]:nth-child(2)').fill('2000'); // Price range slider
    await page.waitForTimeout(1000); // API call delay

    // Check if tutors are filtered
    const tutorCards = await page.locator('[data-testid="tutor-card"]');
    await expect(tutorCards).toHaveCountGreaterThan(0);
  });

  test('should sort tutors by price ascending', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('.grid > div, .flex.flex-col > div');

    // Open sort dropdown and select "Price: Low to High"
    await page.locator('select').selectOption('price-asc');
    await page.waitForTimeout(1000); // Sorting delay

    // Check if tutors are sorted (assuming tutor cards display price)
    const prices = await page.$$eval('[data-testid="tutor-price"]', (nodes) =>
      nodes.map((n) => parseFloat(n.textContent.replace('₹', '')))
    ); // Add data-testid to price element in TutorCard
    const isSortedAsc = prices.every((price, i) => i === 0 || price >= prices[i - 1]);
    expect(isSortedAsc).toBe(true);
  });

  // test('should navigate pagination', async ({ page }) => {
  //   await page.waitForSelector('.grid > div, .flex.flex-col > div');

  //   const activePage = await page.locator('.join-item.btn.bg-blue-800');
  //   await expect(activePage).toHaveText('1');

  //   await page.locator('button:has(svg[data-icon="CircleChevronRight"])').click();
  //   await page.waitForTimeout(1000); // API call delay
  //   const newActivePage = await page.locator('.join-item.btn.bg-blue-800');
  //   await expect(newActivePage).toHaveText('2');

  //   await page.locator('button:has(svg[data-icon="CircleChevronLeft"])').click();
  //   await page.waitForTimeout(1000); // API call delay
  //   await expect(activePage).toHaveText('1');
  // });


test('should navigate pagination', async ({ page }) => {

  await page.waitForSelector('.grid > div, .flex.flex-col > div', { state: 'visible' });
  await page.waitForSelector('.join.flex.justify-center');

  const activePage = await page.locator('.join-item.btn.bg-blue-800');
  await expect(activePage).toHaveText('1');
  const nextButton = await page.locator('[data-testid="next-page-btn"]');
  const prevButton = await page.locator('[data-testid="prev-page-btn"]');
  const totalPages = await page.locator('.join-item.btn').count(); // Number of page buttons
  if (totalPages > 1) {
    await nextButton.click();
    await page.waitForFunction(
      () => document.querySelector('.join-item.btn.bg-blue-800')?.textContent === '2',
      { timeout: 5000 }
    );

    const newActivePage = await page.locator('.join-item.btn.bg-blue-800');
    await expect(newActivePage).toHaveText('2');

    await prevButton.click();

    await page.waitForFunction(
      () => document.querySelector('.join-item.btn.bg-blue-800')?.textContent === '1',
      { timeout: 5000 }
    );
    await expect(activePage).toHaveText('1');
  } else {
    console.log('Only one page available, skipping navigation test.');
    await expect(nextButton).toBeDisabled();
  }
});

  test('should display error message on API failure', async ({ page }) => {
    await page.route('**/api/tutors**', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Failed to fetch tutors' }),
      })
    );

    await page.reload();
    await page.waitForSelector('.alert.alert-error');
    const errorMessage = await page.locator('.alert.alert-error span');
    await expect(errorMessage).toHaveText('Failed to fetch tutors');
  });
});
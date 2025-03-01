import { test, expect } from "@playwright/test";

// Mock API responses
const mockTutorsResponse = {
  tutors: [
    { id: 1, name: "John Doe", hourlyRate: 500, rating: 4.8, subject: "Math" },
    { id: 2, name: "Jane Smith", hourlyRate: 700, rating: 4.5, subject: "Science" },
  ],
  pagination: { totalPages: 2 },
};

test.describe("Browse Tutors Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/tutors*", (route) =>
      route.fulfill({ json: mockTutorsResponse })
    );
    await page.goto("http://localhost:5173/browse");
  });

  test("should render Browse Tutors page", async ({ page }) => {
    await expect(page.locator("text=Browse Tutors")).toBeVisible();
  });

  test("should display loading skeleton while fetching tutors", async ({ page }) => {
    await page.route("**/api/tutors*", async (route) => {
      await new Promise((r) => setTimeout(r, 2000)); // Simulate delay
      await route.fulfill({ json: mockTutorsResponse });
    });
  
    await page.goto("http://localhost:5173/browse");
  
    // Ensure the loading state appears
    const skeletonLocator = page.locator("css=[data-testid='loading-skeleton']");
    await expect(skeletonLocator).toBeVisible();
  
    // Wait for the loading state to disappear
    await expect(skeletonLocator).toHaveCount(0, { timeout: 5000 });
  
    // Ensure tutor data appears after loading
    await expect(page.locator("text=John Doe")).toBeVisible();
  });
  

  test("should display tutors after data fetch", async ({ page }) => {
    await expect(page.locator("text=John Doe")).toBeVisible();
    await expect(page.locator("text=Jane Smith")).toBeVisible();
  });

//   test("should allow searching tutors", async ({ page }) => {
//     await page.fill("#search-input", "Math");
//     await page.keyboard.press("Enter");

//     await expect(page.locator("text=John Doe")).toBeVisible();
//     await expect(page.locator("text=Jane Smith")).not.toBeVisible();
//   });

//   test("should allow filtering by price range", async ({ page }) => {
//     await page.fill("#price-range-input", "600");
//     await page.keyboard.press("Enter");

//     await expect(page.locator("text=John Doe")).not.toBeVisible();
//     await expect(page.locator("text=Jane Smith")).toBeVisible();
//   });

//   test("should allow filtering by rating", async ({ page }) => {
//     await page.fill("#rating-filter", "4.5");
//     await page.keyboard.press("Enter");

//     await expect(page.locator("text=John Doe")).toBeVisible();
//   });

//   test("should allow selecting subjects filter", async ({ page }) => {
//     await page.click("button", { hasText: "Math" });

//     await expect(page.locator("text=John Doe")).toBeVisible();
//     await expect(page.locator("text=Jane Smith")).not.toBeVisible();
//   });

  test("should allow sorting tutors", async ({ page }) => {
    await page.selectOption("#sort-dropdown", "price-desc");

    await expect(page.locator(".tutor-card").first()).toHaveText("Jane Smith");
  });

  test("should allow switching between grid and list view", async ({ page }) => {
    await page.click("#view-list");
    await expect(page.locator(".list-view")).toBeVisible();

    await page.click("#view-grid");
    await expect(page.locator(".grid-view")).toBeVisible();
  });

  test("should handle pagination correctly", async ({ page }) => {
    await page.click("#next-page");
    await expect(page).toHaveURL(/page=2/);

    await page.click("#prev-page");
    await expect(page).toHaveURL(/page=1/);
  });

  test("should display an error message if tutor fetch fails", async ({ page }) => {
    await page.route("**/api/tutors*", (route) =>
      route.fulfill({ status: 500, json: { message: "Failed to fetch tutors" } })
    );

    await page.goto("http://localhost:5173/browse");

    await expect(page.locator(".alert-error")).toHaveText("Failed to fetch tutors");
  });
});

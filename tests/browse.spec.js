import { expect, test } from "@playwright/test";

test.describe("BrowseTutorsPage Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/browse");
  });

  test("should display tutors after loading", async ({ page }) => {
    await page.waitForSelector(".grid > div, .flex.flex-col > div", {
      state: "visible",
    });

    const tutorCards = await page.locator('[data-testid="tutor-card"]');
    await expect(tutorCards).toHaveCount(6);
  });


  test("should navigate pagination", async ({ page }) => {
    await page.waitForSelector(".grid > div, .flex.flex-col > div", {
      state: "visible",
    });
    await page.waitForSelector(".join.flex.justify-center");

    const activePage = await page.locator(".join-item.btn.bg-blue-800");
    await expect(activePage).toHaveText("1");
    const nextButton = await page.locator('[data-testid="next-page-btn"]');
    const prevButton = await page.locator('[data-testid="prev-page-btn"]');
    const totalPages = await page.locator(".join-item.btn").count();
    if (totalPages > 1) {
      await nextButton.click();
      await page.waitForFunction(
        () =>
          document.querySelector(".join-item.btn.bg-blue-800")?.textContent ===
          "2",
        { timeout: 5000 }
      );

      const newActivePage = await page.locator(".join-item.btn.bg-blue-800");
      await expect(newActivePage).toHaveText("2");

      await prevButton.click();

      await page.waitForFunction(
        () =>
          document.querySelector(".join-item.btn.bg-blue-800")?.textContent ===
          "1",
        { timeout: 5000 }
      );
      await expect(activePage).toHaveText("1");
    } else {
      console.log("Only one page available, skipping navigation test.");
      await expect(nextButton).toBeDisabled();
    }
  });

  test("should display error message on API failure", async ({ page }) => {
    await page.route("**/api/tutors**", (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: "Failed to fetch tutors" }),
      })
    );

    await page.reload();
    await page.waitForSelector(".alert.alert-error");
    const errorMessage = await page.locator(".alert.alert-error span");
    await expect(errorMessage).toHaveText("Failed to fetch tutors");
  });
});

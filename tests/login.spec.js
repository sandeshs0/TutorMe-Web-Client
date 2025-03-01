import { expect, test } from "@playwright/test";

// Mock API response for successful login
const mockUserResponse = {
  user: {
    _id: "12345",
    email: "testuser@example.com",
    role: "student",
  },
  token: "mocked-token",
};

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
  });

  test("should render login form", async ({ page }) => {
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#login-button")).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.locator("#login-button").click();
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#password-error")).toBeVisible();
  });

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    await page.locator("#email").fill("invalid-email");
    await page.locator("#password").fill("password123");
    await page.locator("#login-button").click();
    await expect(page.locator("#email-error")).toBeVisible();
  });

  test("should successfully log in and navigate to home for student role", async ({
    page,
  }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({ json: mockUserResponse })
    );

    await page.locator("#email").fill("testuser@example.com");
    await page.locator("#password").fill("password123");
    await page.locator("#login-button").click();

    await expect(page).toHaveURL("http://localhost:5173/");
  });

  test("should successfully log in and navigate to tutor dashboard for tutor role", async ({
    page,
  }) => {
    const tutorResponse = {
      ...mockUserResponse,
      user: { ...mockUserResponse.user, role: "tutor" },
    };
    await page.route("**/auth/login", (route) =>
      route.fulfill({ json: tutorResponse })
    );

    await page.locator("#email").fill("tutor@example.com");
    await page.locator("#password").fill("password123");
    await page.locator("#login-button").click();

    await expect(page).toHaveURL("http://localhost:5173/tutor-dashboard");
  });

  test("should display error message on failed login attempt", async ({
    page,
  }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({ status: 401, json: { message: "Invalid credentials" } })
    );

    await page.locator("#email").fill("wronguser@example.com");
    await page.locator("#password").fill("wrongpassword");
    await page.locator("#login-button").click();

    await expect(page.locator("#general-error")).toBeVisible();
  });
});
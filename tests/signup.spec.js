import { test, expect } from "@playwright/test";

// Mock API responses
const mockStudentSignupResponse = { message: "User Registered successfully" };
const mockTutorSignupResponse = { message: "Tutor Registered successfully" };
const mockOtpVerificationResponse = { message: "OTP verified successfully" };

test.describe("Signup Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/signup");
  });

  test("should render signup form", async ({ page }) => {
    await expect(page.locator("#fullname")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#phone")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#confirm-password")).toBeVisible();
    await expect(page.locator("#signup-button")).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.locator("#signup-button").click();
    await expect(page.locator("#signup-error")).toBeVisible();
  });

  test("should show validation error for invalid email format", async ({ page }) => {
    await page.locator("#email").fill("invalid-email");
    await page.locator("#signup-button").click();
    await expect(page.locator("#signup-error")).toBeVisible();
  });
  
  test("should show password mismatch error", async ({ page }) => {
    await page.locator("#password").fill("StrongPassword1!");
    await page.locator("#confirm-password").fill("DifferentPassword1!");
    await page.locator("#signup-button").click();
    await expect(page.locator("#signup-error")).toBeVisible();
  });

  test("should successfully sign up as a student", async ({ page }) => {
    await page.route("**/auth/register", (route) =>
      route.fulfill({ json: mockStudentSignupResponse })
    );

    await page.locator("#fullname").fill("Test User");
    await page.locator("#email").fill("testuser@example.com");
    await page.locator("#phone").fill("9800000000");
    await page.locator("#username").fill("testuser");
    await page.locator("#password").fill("StrongPass1!");
    await page.locator("#confirm-password").fill("StrongPass1!");
    await page.locator("#signup-button").click();

    await expect(page).toHaveURL("http://localhost:5173/verify-otp");
  });

});
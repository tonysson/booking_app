import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/'

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", {name : "Sign In"}).click();
  await expect(page.getByRole("heading" , {name : "Sign In"})).toBeVisible();
  await page.locator("[name=email]").fill("teyi@gmail.com")
  await page.locator("[name=password]").fill("antoine")
  await page.getByRole("button", {name : "Sign In"}).click();
  await expect(page.getByText("Sign In successful!")).toBeVisible();
  await expect(page.getByRole("link",{name : "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name : "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name : " Sign Out"})).toBeVisible();
});

test('should allow user to register', async({page}) => {
  // Generate ramdom test Register email so that the test can pass every time
  const testEmail = `test_register_${Math.floor(Math.random() * 78788) + 1000}@test.com`;
  await page.goto(UI_URL);
  await page.getByRole("link", {name : "Sign In"}).click();
  await page.getByRole("link", {name : "Create an Account here"}).click();
  await expect(page.getByRole("heading" , {name : "Create an Account"})).toBeVisible();
  await page.locator("[name=firstName]").fill("aellah")
  await page.locator("[name=lastName]").fill("Lawson")
  await page.locator("[name=email]").fill(testEmail)
  await page.locator("[name=password]").fill("aellah")
  await page.locator("[name=confirmPassword]").fill("aellah")
  await page.getByRole("button", {name : "Create Account"}).click();
  await expect(page.getByText("Registration success!")).toBeVisible();
  await expect(page.getByRole("link",{name : "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name : "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name : " Sign Out"})).toBeVisible();
})
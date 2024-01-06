import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173/'

test.beforeEach( async ({page}) => {
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
})

test("Should show hotel search results", async ({page}) => {
    await page.goto(UI_URL);
    await page.getByPlaceholder("Where are you going?").fill("Togoville");
    await page.getByRole("button", {name : "Search"}).click();
    await expect(page.getByText("Hotels found in Togoville")).toBeVisible();
    await expect(page.getByText("Hotel Nachtigal")).toBeVisible();

})
import { test, expect } from '@playwright/test';

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

test("Should show hotel details", async ({page}) => {
    await page.goto(UI_URL);
    await page.getByPlaceholder("Where are you going?").fill("Togoville");
    await page.getByRole("button", {name : "Search"}).click();
    await page.getByText("Hotel Nachtigal").click()
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", {name : "Book now"})).toBeVisible()
})


test("Should book hotel", async ({page}) => {
    await page.goto(UI_URL);
    await page.getByPlaceholder("Where are you going?").fill("Togoville");
    const date = new Date();
    date.setDate(date.getDate() + 3)
    const formattedDate = date.toISOString().split("T")[0]
    await page.getByPlaceholder("Check-out Date").fill(formattedDate);
    await page.getByRole("button", {name : "Search"}).click();
    await page.getByText("Hotel Nachtigal").click();
    await page.getByRole("button", {name : "Book now"}).click()

    await expect(page.getByText("Total Cost : £294.00")).toBeVisible();

    const stripeFrame = page.frameLocator("iframe").first();
    await stripeFrame.locator('[placeholder="Card number"]').fill("4242 4242 4242 4242");
    await stripeFrame.locator('[placeholder="MM / YY"]').fill("O4/30")
    await stripeFrame.locator('[placeholder="CVC"]').fill("424")
    await stripeFrame.locator('[placeholder="ZIP"]').fill("78700")

    await page.getByRole("button",{name : "Confirm Booking"}).click();
    await expect(page.getByText("Booking Saved!")).toBeVisible();

    await page.getByRole("link", { name: "My Bookings" }).click();
    await expect(page.getByText("Hotel Nachtigal")).toBeVisible();
})




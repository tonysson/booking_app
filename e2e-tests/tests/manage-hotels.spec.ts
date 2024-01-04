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

test("Should allow user to add Hotel", async ({page}) => {
    await page.goto(`${UI_URL}add-hotel`);
    await expect(page.getByRole("heading" , {name : "Add Hotel"})).toBeVisible();
    await page.locator('[name="name"]').fill("Beautiful testing hotel!");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is a description for the test Hotel!");

    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starsRating"]', "4");

    await page.getByText("Budget").click();

    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("3");

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files" , "1.jpg"),
        path.join(__dirname, "files" , "2.jpg"),
        path.join(__dirname, "files" , "3.jpg")
    ]);

    await page.getByRole('button',{name  : "Save"}).click();

    await expect(page.getByText("Hotel saved successfully!!")).toBeVisible();

})


test("should display hotels", async ({page}) => {
    await page.goto(`${UI_URL}my-hotels`);
    await expect(page.getByText("Hotel Nachtigal")).toBeVisible();
    await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
    await expect(page.getByText("Togoville")).toBeVisible();
    await expect(page.getByText("Togo")).toBeVisible();
    await expect(page.getByText("Luxury")).toBeVisible();
    await expect(page.getByText("98 € per night")).toBeVisible();
    await expect(page.getByText("3 stars Rating")).toBeVisible();
    await expect( page.getByRole("link",{name : "View Details"}).first()).toBeVisible();
})


test("Should edit Hotel" , async({page}) => {
    await page.goto(`${UI_URL}my-hotels`);
    await page.getByRole("link",{name : "View Details"}).first().click()
    await page.waitForSelector('[name="name"]', {state : "attached"})
    await expect(page.locator('[name="name"]')).toHaveValue('Hotel Nachtigal')
    await page.locator('[name="name"]').fill("Hotel Nachtigal UPDATED")
    await page.getByRole("button",{name : "Save"}).click()
    await expect(page.getByText("Hotel update successfully!!")).toBeVisible();
})






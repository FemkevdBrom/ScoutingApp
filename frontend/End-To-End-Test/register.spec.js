import { test, expect } from '@playwright/test';

test('TC-2 Registeren succesvol', async ({ page }) =>{
    const uniqueEmail= `test${Date.now()}@gmail.com`;

    await page.goto('/register');

    await page.locator('#firstName').fill('Test');
    await page.locator('#lastName').fill('Tester');
    await page.locator('#birthDate').fill('2005-01-01');
    await page.locator('#street').fill('Teststraat');
    await page.locator('#houseNumber').fill('1');
    await page.locator('#postalCode').fill('1234AB');
    await page.locator('#city').fill('Eindhoven');
    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#password').fill('TestWachtwoord!1');
    await page.locator('#passwordCheck').fill('TestWachtwoord!1');
    await page.locator('#scoutingGroupId')
        .selectOption({ label: 'Scouts Eindhoven (Eindhoven)' });

    await page.getByRole('button', { name: 'Registreren' })
        .click();

    await expect(
        page.getByText('Registratie gelukt!')
    ).toBeVisible();
});
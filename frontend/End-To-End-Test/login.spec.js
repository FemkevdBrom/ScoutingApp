import { test, expect } from '@playwright/test';

test('TC-1 Login succesvol', async ({ page }) => {

    await page.goto('/');

    await page.getByPlaceholder('Email')
        .fill('test@gmail.com');

    await page.getByPlaceholder('Wachtwoord')
        .fill('DitWachtwoord!1');

    await page.getByRole('button', { name: 'Login' })
        .click();

    await expect(
        page.getByText('Welcome')
    ).toBeVisible();

});
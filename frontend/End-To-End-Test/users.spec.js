import { test, expect } from '@playwright/test';

test('TC-5 Lid openen', async ({ page }) => {

    // Inloggen
    await page.goto('/');
    await page.getByPlaceholder('Email')
        .fill('test@gmail.com');
    await page.getByPlaceholder('Wachtwoord')
        .fill('DitWachtwoord!1');
    await page.getByRole('button', {
        name: 'Login'
    }).click();
    await expect(
        page.getByText('Welcome')
    ).toBeVisible();
    await page.getByText('Explorers')
        .first()
        .click();
    await expect(page)
        .toHaveURL(/groups\/1/);

    await page.getByText('Jan Jansen')
        .click();

    await expect(page.url())
        .toContain('/users/');

    await expect(
        page.getByRole('heading', {
            name: 'Jan Jansen'
        })
    ).toBeVisible();

    await expect(
        page.getByRole('heading', {
            name: 'Gegevens'
        })
    ).toBeVisible();

    await expect(
        page.getByText('jan@test.nl')
    ).toBeVisible();

});

test('TC-6 Eigen profiel openen', async ({ page }) => {

    // Login
    await page.goto('/');
    await page.getByPlaceholder('Email')
        .fill('test@gmail.com');
    await page.getByPlaceholder('Wachtwoord')
        .fill('DitWachtwoord!1');
    await page.getByRole('button', {
        name: 'Login'
    }).click();
    await page.getByRole('button', {
        name: /Welkom/
    }).click();

    await expect(page.url())
        .toContain('/profile');

    await expect(
        page.getByText('Mijn gegevens')
    ).toBeVisible();
    await expect(
        page.getByText('Mijn groepen')
    ).toBeVisible();

});
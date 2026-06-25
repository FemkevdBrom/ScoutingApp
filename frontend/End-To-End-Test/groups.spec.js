import { test, expect } from '@playwright/test';

test('TC-3 Groep openen', async ({ page }) => {

    //eerst moeten we inloggen omdat de groupen op een pagina zijn die je alleen kan bereiekn als je ingelogd ben.
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

    await page.getByText('Explorers')
        .first()
        .click();

    await expect(page).toHaveURL(/groups\/1/);

    await expect(
        page.getByRole('heading', { name: 'Explorers' })
    ).toBeVisible();

});
/* test('TC-4 Groepsgegevens aanpassen', async ({ page }) => {

    // Login en naar groupspagina gaan.
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
    await page.getByText('Explorers')
        .first()
        .click();
    await expect(page)
        .toHaveURL(/groups\/1/);

    await page.getByRole('button', {
        name: 'Groepsgegevens aanpassen'
    }).click();

    await expect(
        page.getByRole('heading', {
            name: 'Groepsgegevens aanpassen'
        })
    ).toBeVisible();

    const nieuweBeschrijving =
        `Playwright Test ${Date.now()}`;

    await page.locator('input').nth(1)
        .fill(nieuweBeschrijving);

    await page.getByRole('button', {
        name: 'Opslaan'
    }).click();

    console.log(await page.url());

    await page.waitForTimeout(5000);

    await expect(page)
        .toHaveURL(/groups\/1/);

    await expect(
        page.getByText('Groepsinformatie')
    ).toBeVisible();

});
*/
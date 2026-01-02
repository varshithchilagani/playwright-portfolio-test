import { test, expect } from '@playwright/test';

test.describe('Portfolio smoke tests', () => {
  test('Homepage loads, title contains "Varshith Chilagani"', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Varshith Chilagani/i);
    await expect(page.getByRole('heading', { name: /varshith chilagani/i })).toBeVisible();
  });

  test('Click GitHub link, new tab opens github.com', async ({ page }) => {
    await page.goto('/');
    const githubLink = page.getByRole('link', { name: 'GitHub', exact: true });
    await expect(githubLink).toBeVisible();

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      githubLink.click(),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL(/github\.com/i);
  });

  test('Click LinkedIn link, linkedin.com loads', async ({ page }) => {
    await page.goto('/');
    const linkedInLink = page.getByRole('link', { name: /linkedin/i });
    await expect(linkedInLink).toBeVisible();

    const popupPromise = page.waitForEvent('popup').then(p => ({ type: 'popup' as const, page: p }));
    const navPromise = page.waitForNavigation().then(() => ({ type: 'nav' as const, page }));

    await linkedInLink.click();

    const outcome = await Promise.race([popupPromise, navPromise]);

    if (outcome.type === 'popup') {
      await outcome.page.waitForLoadState('domcontentloaded');
      await expect(outcome.page).toHaveURL(/linkedin\.com/i);
    } else {
      await expect(page).toHaveURL(/linkedin\.com/i);
    }
  });

  test('Scroll to Projects section, assert Snowflake project visible', async ({ page }) => {
    await page.goto('/');

    const projectsHeading = page.getByRole('heading', { name: /projects?/i }).first();
    await projectsHeading.scrollIntoViewIfNeeded();
    await expect(projectsHeading).toBeVisible();

    // Scope to Projects/My Work section to avoid matching skills list occurrences
    const projectsSection = page.locator('#my-work').first();

    const snowflakeNode = projectsSection
      .getByRole('heading', { name: /snowflake/i })
      .or(projectsSection.getByRole('link', { name: /snowflake/i }));

    await expect(snowflakeNode.first()).toBeVisible();
  });
});

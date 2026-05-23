import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
    test('should have title', async ({ page }) => {
        await page.goto('http://example.com');
        const title = page.title();
        await expect(title).resolves.toBeTruthy();
    });

    test('should find element by text', async ({ page }) => {
        await page.goto('http://example.com');
        const element = page.locator('text=Example Domain');
        await expect(element).toBeVisible();
    });
});

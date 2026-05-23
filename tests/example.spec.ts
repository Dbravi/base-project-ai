import { test, expect } from '@playwright/test';

test.describe('Example Tests - Positive Cases', () => {
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

    test('should have main header', async ({ page }) => {
        await page.goto('http://example.com');
        const header = page.locator('h1');
        await expect(header).toBeVisible();
    });

    test('should have paragraph', async ({ page }) => {
        await page.goto('http://example.com');
        const para = page.locator('p').first();
        await expect(para).toBeVisible();
    });

    test('should have link', async ({ page }) => {
        await page.goto('http://example.com');
        const link = page.locator('a');
        await expect(link).toBeVisible();
    });
});

test.describe('Example Tests - Negative Cases', () => {
    test('should not find nonexistent element', async ({ page }) => {
        await page.goto('http://example.com');
        const missing = page.locator('#nonexistent');
        await expect(missing).toBeHidden();
    });

    test('should not find element with wrong text', async ({ page }) => {
        await page.goto('http://example.com');
        const element = page.locator('text=Wrong Text');
        await expect(element).not.toBeVisible();
    });

    test('should handle invalid url gracefully', async ({ page }) => {
        let failed = false;
        try {
            await page.goto('http://invalid-url-that-does-not-exist-12345.com', { timeout: 5000 });
        } catch {
            failed = true;
        }
        expect(failed).toBe(true);
    });

    test('should not equal different values', async () => {
        expect('foo').not.toBe('bar');
    });

    test('should timeout on hidden element', async ({ page }) => {
        await page.goto('http://example.com');
        const hidden = page.locator('#hidden-element');
        let timedOut = false;
        try {
            await expect(hidden).toBeVisible({ timeout: 100 });
        } catch {
            timedOut = true;
        }
        expect(timedOut).toBe(true);
    });
});

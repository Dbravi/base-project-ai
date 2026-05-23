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

    test('should have main header', async ({ page }) => {
        await page.goto('http://example.com');
        const header = page.locator('h1');
        await expect(header).toBeVisible();
    });

    test('should have paragraph', async ({ page }) => {
        await page.goto('http://example.com');
        const para = page.locator('p');
        await expect(para).toBeVisible();
    });

    test('should have link', async ({ page }) => {
        await page.goto('http://example.com');
        const link = page.locator('a');
        await expect(link).toBeVisible();
    });

    test('should fail - missing element', async ({ page }) => {
        await page.goto('http://example.com');
        const missing = page.locator('#nonexistent');
        await expect(missing).toBeVisible();
    });

    test('should fail - wrong text', async ({ page }) => {
        await page.goto('http://example.com');
        const element = page.locator('text=Wrong Text');
        await expect(element).toBeVisible();
    });

    test('should fail - invalid url', async ({ page }) => {
        await page.goto('http://invalid-url-that-does-not-exist-12345.com');
        const element = page.locator('body');
        await expect(element).toBeVisible();
    });

    test('should fail - assertion error', async ({ page }) => {
        await page.goto('http://example.com');
        expect('foo').toBe('bar');
    });

    test('should fail - timeout on element', async ({ page }) => {
        await page.goto('http://example.com');
        const hidden = page.locator('#hidden-element');
        await expect(hidden).toBeVisible({ timeout: 100 });
    });
});

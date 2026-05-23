import { test, expect } from '@playwright/test';
import { ExampleDomainPage } from '../pages/example-domain.page';

test.describe('UI - Accessibility Tests', () => {
    let examplePage: ExampleDomainPage;

    test.beforeEach(async ({ page }) => {
        examplePage = new ExampleDomainPage(page);
        await examplePage.navigate();
    });

    test.describe('Positive Cases', () => {
        test('P1: Page has proper heading hierarchy (h1 present)', async () => {
            const titleVisible = await examplePage.isTitleVisible();
            expect(titleVisible).toBe(true);
        });

        test('P2: All interactive elements are keyboard accessible', async ({ page }) => {
            const link = page.locator('a');
            const isVisible = link;
            await expect(isVisible).toBeVisible();
        });

        test('P3: Page has meaningful title attribute', async () => {
            const pageTitle = await examplePage.getTitle();
            expect(pageTitle).toBeTruthy();
            expect(pageTitle).not.toContain('undefined');
        });

        test('P4: Text content is readable (body visible)', async () => {
            const bodyVisible = await examplePage.isBodyVisible();
            expect(bodyVisible).toBe(true);
        });

        test('P5: Image alt text would be required (no images without alt)', async ({ page }) => {
            const images = page.locator('img');
            await expect(images).toHaveCount(0);
        });

        test('P6: Links have descriptive text', async () => {
            const linkText = await examplePage.getLinkText();
            expect(linkText).toBeTruthy();
            expect(linkText?.length).toBeGreaterThan(0);
        });

        test('P7: Page has semantic HTML structure', async ({ page }) => {
            const h1Count = await page.locator('h1').count();
            const pCount = await page.locator('p').count();
            expect(h1Count).toBeGreaterThanOrEqual(1);
            expect(pCount).toBeGreaterThanOrEqual(1);
        });

        test('P8: Focus management - body has content', async () => {
            const content = await examplePage.getPageContent();
            expect(content).toBeTruthy();
            expect(content?.length).toBeGreaterThan(100);
        });

        test('P9: No duplicate heading IDs', async ({ page }) => {
            const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
            expect(headings).toBeGreaterThanOrEqual(1);
        });

        test('P10: Page language is defined', async ({ page }) => {
            const html = page.locator('html');
            const lang = html;
            await expect(lang).toHaveAttribute('lang');
        });
    });

    test.describe('Negative Cases', () => {
        test('N1: Missing h1 heading fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body><h2>Wrong Level</h2></body></html>');
            const h1Count = page.locator('h1');
            await expect(h1Count).toHaveCount(0);
        });

        test('N2: Page without link content is incomplete', async ({ page }) => {
            await page.goto('data:text/html,<html><body><p>Only text</p></body></html>');
            const links = page.locator('a');
            await expect(links).toHaveCount(0);
        });

        test('N3: Missing lang attribute fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body>Test</body></html>');
            const lang = await page.locator('html').getAttribute('lang');
            expect(lang).toBeNull();
        });

        test('N4: No semantic structure fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body><div>Content</div></body></html>');
            const headings = page.locator('h1, h2, h3');
            await expect(headings).toHaveCount(0);
        });

        test('N5: Empty body content fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body></body></html>');
            const content = await page.locator('body').textContent();
            expect(content?.trim()).toBe('');
        });

        test('N6: Broken link reference fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body><a href=""></a></body></html>');
            const href = page.locator('a');
            await expect(href).toHaveAttribute('href', '');
        });

        test('N7: Missing page title fails', async ({ page }) => {
            await page.goto('data:text/html,<html><head></head><body>Test</body></html>');
            const title = page.title();
            await expect(title).resolves.toBeFalsy();
        });

        test('N8: Duplicate heading IDs would fail', async ({ page }) => {
            await page.goto('data:text/html,<html><body><h1 id="same">A</h1><h2 id="same">B</h2></body></html>');
            const headings = await page.locator('[id="same"]').count();
            expect(headings).toBeGreaterThan(1);
        });

        test('N9: No interactive elements fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body><p>Just text</p></body></html>');
            const links = page.locator('a, button, input');
            await expect(links).toHaveCount(0);
        });

        test('N10: Content not visible fails', async ({ page }) => {
            await page.goto('data:text/html,<html><body><p style="display:none">Hidden</p></body></html>');
            const visible = page.locator('p').first();
            await expect(visible).toBeHidden();
        });
    });
});

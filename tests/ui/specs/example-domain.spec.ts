import { test, expect } from '../../fixtures';

test.describe('Example Domain', () => {
    test('page loads successfully', async ({ examplePage }) => {
        await expect(examplePage.heading).toBeVisible();
    });

    test('heading is visible', async ({ examplePage }) => {
        await expect(examplePage.heading).toBeVisible();
    });

    test('description is present', async ({ examplePage }) => {
        await expect(examplePage.description).toBeVisible();
    });

    test('link exists on page', async ({ examplePage }) => {
        await expect(examplePage.moreLink).toBeVisible();
    });

    test('link has href attribute', async ({ examplePage }) => {
        await expect(examplePage.moreLink).toHaveAttribute('href', /https?:\/\//);
    });

    test('page loads within reasonable time', async ({ examplePage }) => {
        const startTime = Date.now();
        await examplePage.goto();
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(5000);
    });

    test('no console errors on load', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        expect(errors).toHaveLength(0);
    });

    test('response is 200 OK', async ({ request }) => {
        const response = await request.get('/');
        expect(response.status()).toBe(200);
    });

    test('response contains HTML', async ({ request }) => {
        const response = await request.get('/');
        const text = await response.text();
        expect(text).toContain('<html');
        expect(text).toContain('</html>');
    });

    test('link href is valid URL', async ({ examplePage }) => {
        const href = await examplePage.moreLink.getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);
    });
});

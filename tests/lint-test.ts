import { test } from '@playwright/test';

test('bad', async ({ page }) => {
    const x: any = 'test';
    await page.goto('http://example.com');
});

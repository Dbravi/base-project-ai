import { test, expect } from '@playwright/test';

test.describe('API - HTTP Methods', () => {
    test('GET request succeeds', async ({ request }) => {
        const response = await request.get('/');
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
    });

    test('response contains valid HTML', async ({ request }) => {
        const response = await request.get('/');
        const text = await response.text();
        expect(text).toContain('<html');
        expect(text).toContain('Example Domain');
        expect(text).toContain('</html>');
    });

    test('response headers are set correctly', async ({ request }) => {
        const response = await request.get('/');
        expect(response.headers()['content-type']).toContain('text/html');
    });

    test('invalid endpoint returns 404', async ({ request }) => {
        const response = await request.get('/nonexistent-page-xyz', { failOnStatusCode: false });
        expect(response.status()).toBe(404);
    });

    test('request with custom headers succeeds', async ({ request }) => {
        const response = await request.get('/', {
            headers: {
                'User-Agent': 'Playwright-Test',
            },
        });
        expect(response.ok()).toBeTruthy();
    });
});

test.describe('API - Network Behavior', () => {
    test('response is not empty', async ({ request }) => {
        const response = await request.get('/');
        const text = await response.text();
        expect(text.length).toBeGreaterThan(100);
    });

    test('response completes within timeout', async ({ request }) => {
        const startTime = Date.now();
        const response = await request.get('/');
        const duration = Date.now() - startTime;
        expect(response.ok()).toBeTruthy();
        expect(duration).toBeLessThan(5000);
    });

    test('HEAD request returns headers without body', async ({ request }) => {
        const response = await request.head('/');
        expect(response.status()).toBe(200);
    });

    test('multiple requests succeed in sequence', async ({ request }) => {
        const res1 = await request.get('/');
        const res2 = await request.get('/');
        expect(res1.ok()).toBeTruthy();
        expect(res2.ok()).toBeTruthy();
    });

    test('responses are consistent', async ({ request }) => {
        const res1 = await request.get('/');
        const text1 = await res1.text();
        const res2 = await request.get('/');
        const text2 = await res2.text();
        expect(text1).toBe(text2);
    });
});

test.describe('API - Error Handling', () => {
    test('unreachable host fails gracefully', async ({ request }) => {
        let failed = false;
        try {
            await request.get('http://192.0.2.1', { timeout: 2000 });
        } catch {
            failed = true;
        }
        expect(failed).toBe(true);
    });

    test('malformed URL fails', async ({ request }) => {
        let failed = false;
        try {
            await request.get('http://invalid..domain..com');
        } catch {
            failed = true;
        }
        expect(failed).toBe(true);
    });

    test('response status codes are valid HTTP', async ({ request }) => {
        const response = await request.get('/');
        expect(response.status()).toBeGreaterThanOrEqual(100);
        expect(response.status()).toBeLessThan(600);
    });

    test('404 response is identifiable', async ({ request }) => {
        const response = await request.get('/does-not-exist', { failOnStatusCode: false });
        expect(response.status()).not.toBe(200);
        expect(response.status()).not.toBeGreaterThanOrEqual(500);
    });

    test('response headers present for successful request', async ({ request }) => {
        const response = await request.get('/');
        const headers = response.headers();
        expect(Object.keys(headers).length).toBeGreaterThan(0);
    });
});

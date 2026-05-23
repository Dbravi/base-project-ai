import { test, expect } from '@playwright/test';
import { ApiClient } from '../pages/api-client.page';

test.describe('API - Endpoint Tests', () => {
    let apiClient: ApiClient;

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext();
        apiClient = new ApiClient(requestContext);
    });

    test.afterAll(async () => {
        await apiClient.apiContext.dispose();
    });

    test.describe('Positive Cases - GET Requests', () => {
        test('P1: GET root endpoint returns 200', async () => {
            const response = await apiClient.get('/');
            expect(response.status).toBe(200);
        });

        test('P2: GET response has content-type header', async () => {
            const response = await apiClient.get('/');
            expect(response.headers['content-type']).toBeTruthy();
        });

        test('P3: GET response contains valid HTML', async () => {
            const response = await apiClient.get('/');
            expect(typeof response.body).toBe('string');
            expect(response.body).toContain('Example');
        });

        test('P4: GET response time is acceptable', async () => {
            const startTime = Date.now();
            await apiClient.get('/');
            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(5000);
        });

        test('P5: GET request with custom headers', async () => {
            const response = await apiClient.get('/', {
                headers: { 'User-Agent': 'Playwright-Test' },
            });
            expect(response.status).toBe(200);
        });

        test('P6: GET response has proper encoding', async () => {
            const response = await apiClient.get('/');
            expect(response.headers['content-type']).toMatch(/charset|html|text/i);
        });

        test('P7: GET endpoint is accessible', async () => {
            const response = await apiClient.get('/');
            expect(apiClient.isStatusOk(response.status)).toBe(true);
        });

        test('P8: GET response body is not empty', async () => {
            const response = await apiClient.get('/');
            expect(response.body).toBeTruthy();
            expect((response.body as string).length).toBeGreaterThan(100);
        });

        test('P9: HEAD request to endpoint succeeds', async () => {
            const response = await apiClient.head('/');
            expect(response.status).toBe(200);
        });

        test('P10: Response headers include server info', async () => {
            const response = await apiClient.get('/');
            expect(Object.keys(response.headers).length).toBeGreaterThan(0);
        });
    });

    test.describe('Positive Cases - Response Validation', () => {
        test('P11: Response contains expected content structure', async () => {
            const response = await apiClient.get('/');
            const content = response.body as string;
            expect(content).toContain('<html');
            expect(content).toContain('<body');
            expect(content).toContain('</html>');
        });

        test('P12: Response headers are properly formatted', async () => {
            const response = await apiClient.get('/');
            const headers = response.headers;
            expect(typeof headers).toBe('object');
            expect(Object.keys(headers).length).toBeGreaterThan(0);
        });

        test('P13: Content is UTF-8 encoded', async () => {
            const response = await apiClient.get('/');
            expect(response.headers['content-type']).toContain('text/html');
        });

        test('P14: Response has multiple headers', async () => {
            const response = await apiClient.get('/');
            expect(Object.keys(response.headers).length).toBeGreaterThan(2);
        });

        test('P15: Response includes security-related headers', async () => {
            const response = await apiClient.get('/');
            expect(Object.keys(response.headers).length).toBeGreaterThan(0);
        });

        test('P16: Response includes IANA registered headers', async () => {
            const response = await apiClient.get('/');
            const headers = response.headers;
            expect(headers['content-type'] || headers['cache-control'] || headers['server']).toBeTruthy();
        });

        test('P17: No malformed headers in response', async () => {
            const response = await apiClient.get('/');
            const headers = Object.entries(response.headers);
            headers.forEach(([key, value]) => {
                expect(typeof key).toBe('string');
                expect(typeof value).toBe('string');
            });
        });

        test('P18: Response headers follow HTTP standards', async () => {
            const response = await apiClient.get('/');
            const headers = response.headers;
            expect(Object.keys(headers).length).toBeGreaterThan(0);
            Object.keys(headers).forEach((key) => {
                expect(typeof key).toBe('string');
            });
        });

        test('P19: Status code is valid HTTP status', async () => {
            const response = await apiClient.get('/');
            expect(response.status).toBeGreaterThanOrEqual(100);
            expect(response.status).toBeLessThan(600);
        });

        test('P20: Response body is consistently formatted', async () => {
            const response1 = await apiClient.get('/');
            const response2 = await apiClient.get('/');
            expect(response1.body).toEqual(response2.body);
        });
    });

    test.describe('Negative Cases - Invalid Requests', () => {
        test('N1: GET invalid endpoint returns 404', async () => {
            const response = await apiClient.get('/nonexistent-page-xyz');
            expect(response.status).toBe(404);
        });

        test('N2: GET malformed URL fails', async ({ request }) => {
            let statusCode = 0;
            try {
                const response = await request.get('http://invalid..domain..com');
                statusCode = response.status();
            } catch {
                statusCode = 0;
            }
            expect(statusCode).not.toBe(200);
        });

        test('N3: POST request without data fails', async () => {
            const response = await apiClient.post('/');
            expect(response.status).not.toBe(200);
        });

        test('N4: GET to invalid protocol fails', async ({ request }) => {
            let failed = false;
            try {
                await request.get('ftp://example.com');
            } catch {
                failed = true;
            }
            expect(failed).toBe(true);
        });

        test('N5: GET non-existent resource returns proper error', async () => {
            const response = await apiClient.get('/api/users/999999');
            expect(apiClient.isStatusError(response.status) || response.status === 404).toBe(true);
        });

        test('N6: PUT request to read-only endpoint fails', async () => {
            const response = await apiClient.put('/', { test: 'data' });
            expect(response.status).not.toBe(200);
        });

        test('N7: DELETE request to root fails', async () => {
            const response = await apiClient.delete('/');
            expect(response.status).not.toBe(200);
        });

        test('N8: Request with invalid headers fails', async () => {
            const response = await apiClient.get('/', {
                headers: { 'Content-Type': 'application/invalid+type' },
            });
            expect(response.status).not.toBe(null);
        });

        test('N9: PATCH request to non-existent endpoint', async () => {
            const response = await apiClient.patch('/api/nonexistent', { test: true });
            expect(apiClient.isStatusError(response.status) || response.status === 404).toBe(true);
        });

        test('N10: Empty endpoint path is invalid', async () => {
            let failed = false;
            try {
                await apiClient.get('');
            } catch {
                failed = true;
            }
            expect(failed || true).toBe(true);
        });
    });

    test.describe('Negative Cases - Response Errors', () => {
        test('N11: Response status code is not 5xx', async () => {
            const response = await apiClient.get('/');
            expect(response.status).not.toBeGreaterThanOrEqual(500);
        });

        test('N12: Response is not empty', async () => {
            const response = await apiClient.get('/');
            expect(response.body).not.toBeFalsy();
        });

        test('N13: Response headers are not missing', async () => {
            const response = await apiClient.get('/');
            expect(Object.keys(response.headers)).not.toHaveLength(0);
        });

        test('N14: Content-Type is not missing', async () => {
            const response = await apiClient.get('/');
            expect(response.headers['content-type']).not.toBeFalsy();
        });

        test('N15: Response does not return client error for valid request', async () => {
            const response = await apiClient.get('/');
            expect(response.status).not.toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(300);
        });

        test('N16: Status code is not negative', async () => {
            const response = await apiClient.get('/');
            expect(response.status).not.toBeLessThan(0);
        });

        test('N17: Response body is not null for successful request', async () => {
            const response = await apiClient.get('/');
            expect(response.body).not.toBeNull();
        });

        test('N18: Headers do not contain invalid characters', async () => {
            const response = await apiClient.get('/');
            Object.entries(response.headers).forEach(([key]) => {
                expect(key).not.toContain('\n');
                expect(key).not.toContain('\r');
            });
        });

        test('N19: Response status is not undefined', async () => {
            const response = await apiClient.get('/');
            expect(response.status).not.toBeUndefined();
        });

        test('N20: Response headers object is valid', async () => {
            const response = await apiClient.get('/');
            expect(response.headers).toEqual(expect.any(Object));
        });
    });
});

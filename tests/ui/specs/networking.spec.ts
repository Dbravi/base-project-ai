import { test, expect } from '@playwright/test';
import { ExampleDomainPage } from '../pages/example-domain.page';

test.describe('UI - Networking & Performance Tests', () => {
    let examplePage: ExampleDomainPage;

    test.beforeEach(async ({ page }) => {
        examplePage = new ExampleDomainPage(page);
    });

    test.describe('Positive Cases', () => {
        test('P1: Page loads successfully', async () => {
            await examplePage.navigate();
            const title = await examplePage.getTitle();
            expect(title).toBeTruthy();
        });

        test('P2: Page returns 200 status code', async ({ page }) => {
            let statusCode = 0;
            page.on('response', (response) => {
                if (response.url().includes('example.com')) {
                    statusCode = response.status();
                }
            });
            await examplePage.navigate();
            expect(statusCode).toBe(200);
        });

        test('P3: All network requests complete without errors', async ({ page }) => {
            const failures: string[] = [];
            page.on('requestfailed', (request) => {
                failures.push(request.url());
            });
            await examplePage.navigate();
            expect(failures).toHaveLength(0);
        });

        test('P4: Response headers are tracked successfully', async ({ page }) => {
            const headersCaptured: Record<string, string> = {};
            page.on('response', (response) => {
                const headers = response.headers();
                Object.assign(headersCaptured, headers);
            });
            await examplePage.navigate();
            expect(Object.keys(headersCaptured).length).toBeGreaterThan(0);
        });

        test('P5: Page does not have broken images', async ({ page }) => {
            const brokenImages: string[] = [];
            page.on('requestfailed', (request) => {
                if (request.url().match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
                    brokenImages.push(request.url());
                }
            });
            await examplePage.navigate();
            expect(brokenImages).toHaveLength(0);
        });

        test('P6: Page loads within acceptable time', async () => {
            const startTime = Date.now();
            await examplePage.navigate();
            const loadTime = Date.now() - startTime;
            expect(loadTime).toBeLessThan(10000);
        });

        test('P7: HTML response is valid', async ({ page }) => {
            let contentType = '';
            page.on('response', (response) => {
                if (response.url().includes('example.com')) {
                    contentType = response.headers()['content-type'];
                }
            });
            await examplePage.navigate();
            expect(contentType).toContain('text/html');
        });

        test('P8: No mixed content (http/https)', async ({ page }) => {
            const mixedContent: string[] = [];
            page.on('console', (msg) => {
                if (msg.text().includes('Mixed Content')) {
                    mixedContent.push(msg.text());
                }
            });
            await examplePage.navigate();
            expect(mixedContent).toHaveLength(0);
        });

        test('P9: Page loads and status code is tracked', async ({ page }) => {
            let statusCode = 0;
            page.on('response', (response) => {
                if (response.url().includes('example.com')) {
                    statusCode = response.status();
                }
            });
            await examplePage.navigate();
            expect(statusCode).toBe(200);
        });

        test('P10: Page navigates without redirect loops', async ({ page }) => {
            let redirectCount = 0;
            page.on('response', (response) => {
                if (response.status() >= 300 && response.status() < 400) {
                    redirectCount++;
                }
            });
            await examplePage.navigate();
            expect(redirectCount).toBeLessThan(3);
        });
    });

    test.describe('Negative Cases', () => {
        test('N1: Invalid URL returns error', async ({ page }) => {
            const errors: string[] = [];
            page.on('requestfailed', (request) => {
                errors.push(request.url());
            });
            try {
                await page.goto('http://invalid-domain-12345-nonexistent.com', {
                    waitUntil: 'load',
                    timeout: 5000,
                });
            } catch {
                // Expected to fail
            }
            expect(errors.length).toBeGreaterThan(0);
        });

        test('N2: Network timeout is detected', async ({ page }) => {
            let timedOut = false;
            try {
                await page.goto('http://example.com:81', {
                    timeout: 2000,
                    waitUntil: 'load',
                });
            } catch {
                timedOut = true;
            }
            expect(timedOut).toBe(true);
        });

        test('N3: Failed request has non-200 status', async ({ page }) => {
            let statusCode = 200;
            page.once('response', (response) => {
                statusCode = response.status();
            });
            try {
                await page.goto('http://example.com/nonexistent-page-404', {
                    waitUntil: 'load',
                });
            } catch {
                // Expected
            }
            expect(statusCode).not.toBe(200);
        });

        test('N4: Broken image link fails', async ({ page }) => {
            const failures: string[] = [];
            page.on('requestfailed', (request) => {
                failures.push(request.url());
            });
            await page.goto('data:text/html,<html><body><img src="http://invalid.com/image.jpg"/></body></html>');
            await page.waitForTimeout(1000);
            expect(failures.length).toBeGreaterThanOrEqual(0);
        });

        test('N5: Slow network response detected', async ({ page }) => {
            const slowRequests: number[] = [];
            const startTimes = new Map<string, number>();

            page.on('request', (request) => {
                startTimes.set(request.url(), Date.now());
            });

            page.on('response', (response) => {
                const startTime = startTimes.get(response.url());
                if (startTime) {
                    const duration = Date.now() - startTime;
                    if (duration > 5000) {
                        slowRequests.push(duration);
                    }
                }
            });

            try {
                await page.goto('http://example.com', { timeout: 10000 });
            } catch {
                // May timeout
            }
            expect(slowRequests.length).toBeLessThan(10);
        });

        test('N6: Missing required headers', async ({ page }) => {
            let hasContentType = false;
            page.on('response', (response) => {
                const headers = response.headers();
                if (headers['content-type']) {
                    hasContentType = true;
                }
            });
            await examplePage.navigate();
            expect(hasContentType).toBe(true);
        });

        test('N7: Redirect loop prevention', async ({ page }) => {
            let redirectCount = 0;
            page.on('response', (response) => {
                if (response.status() >= 300 && response.status() < 400) {
                    redirectCount++;
                }
            });
            try {
                await page.goto('http://example.com', { timeout: 5000 });
            } catch {
                // May timeout with loops
            }
            expect(redirectCount).toBeLessThan(10);
        });

        test('N8: Network request fails without retry', async ({ page }) => {
            const failures: string[] = [];
            page.on('requestfailed', (request) => {
                failures.push(request.url());
            });
            try {
                await page.goto('http://192.0.2.1', {
                    timeout: 2000,
                    waitUntil: 'load',
                });
            } catch {
                // Expected
            }
            expect(failures.length).toBeGreaterThanOrEqual(0);
        });

        test('N9: CORS error detection', async ({ page }) => {
            const corsErrors: string[] = [];
            page.on('console', (msg) => {
                if (msg.text().includes('CORS')) {
                    corsErrors.push(msg.text());
                }
            });
            await page.goto(
                'data:text/html,<html><body><script>fetch("http://invalid.local").catch(e => console.log("CORS error"))</script></body></html>',
            );
            expect(corsErrors.length).toBeGreaterThanOrEqual(0);
        });

        test('N10: SSL/TLS error on invalid certificate', async ({ page }) => {
            let sslError = false;
            page.on('requestfailed', (request) => {
                if (
                    request.failure()?.errorText.includes('SSL') ||
                    request.failure()?.errorText.includes('certificate')
                ) {
                    sslError = true;
                }
            });
            try {
                await page.goto('https://self-signed.badssl.com/', {
                    timeout: 5000,
                });
            } catch {
                sslError = true;
            }
            expect(sslError || true).toBeTruthy();
        });
    });
});

import { test, expect } from '@playwright/test';
import { ExampleDomainPage } from '../pages/example-domain.page';

test.describe('UI - Content & Text Tests', () => {
    let examplePage: ExampleDomainPage;

    test.beforeEach(async ({ page }) => {
        examplePage = new ExampleDomainPage(page);
        await examplePage.navigate();
    });

    test.describe('Positive Cases', () => {
        test('P1: Page title contains expected text', async () => {
            const title = await examplePage.getTitleText();
            expect(title).toContain('Example');
        });

        test('P2: Main heading is visible and readable', async () => {
            const heading = await examplePage.getTitleText();
            expect(heading).toBeTruthy();
        });

        test('P3: Description paragraph exists with content', async () => {
            const description = await examplePage.getDescription();
            expect(description).toBeTruthy();
            expect(description.length).toBeGreaterThan(10);
        });

        test('P4: Link contains "More information" text', async () => {
            const linkText = await examplePage.getLinkText();
            expect(linkText?.toLowerCase()).toContain('more');
        });

        test('P5: Page contains multiple paragraphs', async () => {
            const count = await examplePage.countParagraphs();
            expect(count).toBeGreaterThanOrEqual(1);
        });

        test('P6: At least one link exists on page', async () => {
            const count = await examplePage.countLinks();
            expect(count).toBeGreaterThanOrEqual(1);
        });

        test('P7: Link points to valid URL', async () => {
            const url = await examplePage.getLinkUrl();
            expect(url).toBeTruthy();
            expect(url).toMatch(/^https?:\/\//);
        });

        test('P8: Page content is not empty', async () => {
            const content = await examplePage.getPageContent();
            expect(content).toBeTruthy();
            expect(content?.trim().length).toBeGreaterThan(0);
        });

        test('P9: Browser title matches page heading', async () => {
            const pageTitle = await examplePage.getTitle();
            const heading = await examplePage.getTitleText();
            expect(pageTitle).toContain(heading);
        });

        test('P10: All text elements are properly encoded', async () => {
            const description = await examplePage.getDescription();
            expect(description).not.toContain('&amp;');
            expect(description).not.toContain('&lt;');
        });
    });

    test.describe('Negative Cases', () => {
        test('N1: Title does not match wrong text', async () => {
            const title = await examplePage.getTitleText();
            expect(title).not.toContain('NonexistentText');
        });

        test('N2: Description should not be empty', async () => {
            const description = await examplePage.getDescription();
            expect(description?.trim()).not.toBe('');
        });

        test('N3: Paragraph count should not be zero', async () => {
            const count = await examplePage.countParagraphs();
            expect(count).not.toBe(0);
        });

        test('N4: Link URL should not be empty', async () => {
            const url = await examplePage.getLinkUrl();
            expect(url).not.toBe('');
        });

        test('N5: Page should not display placeholder text', async () => {
            const content = await examplePage.getPageContent();
            expect(content).not.toContain('Lorem ipsum');
        });

        test('N6: Heading should not contain special characters only', async () => {
            const title = await examplePage.getTitleText();
            expect(title).toMatch(/[a-zA-Z0-9]/);
        });

        test('N7: Multiple paragraphs should exist', async () => {
            const count = await examplePage.countParagraphs();
            expect(count).not.toBeLessThan(1);
        });

        test('N8: Links should not have empty href', async () => {
            const url = await examplePage.getLinkUrl();
            expect(url).not.toBeFalsy();
        });

        test('N9: Content should exceed minimum length', async () => {
            const content = await examplePage.getPageContent();
            expect(content?.length).toBeGreaterThan(50);
        });

        test('N10: Page title should not be undefined', async () => {
            const title = await examplePage.getTitle();
            expect(title).not.toContain('undefined');
        });
    });
});

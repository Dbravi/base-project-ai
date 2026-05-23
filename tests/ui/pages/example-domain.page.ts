import { Page } from '@playwright/test';

export class ExampleDomainPage {
    readonly page: Page;

    // Locators
    readonly title = () => this.page.locator('h1');
    readonly description = () => this.page.locator('p').first();
    readonly moreInfoLink = () => this.page.locator('a');
    readonly body = () => this.page.locator('body');
    readonly allParagraphs = () => this.page.locator('p');
    readonly allLinks = () => this.page.locator('a');
    readonly html = () => this.page.locator('html');

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(): Promise<void> {
        await this.page.goto('/');
    }

    async getTitle(): Promise<string | null> {
        return this.page.title();
    }

    async getTitleText(): Promise<string> {
        return this.title().textContent({ timeout: 5000 });
    }

    async getDescription(): Promise<string> {
        return this.description().textContent({ timeout: 5000 });
    }

    async getLinkText(): Promise<string> {
        return this.moreInfoLink().textContent({ timeout: 5000 });
    }

    async getLinkUrl(): Promise<string | null> {
        return this.moreInfoLink().getAttribute('href', { timeout: 5000 });
    }

    async countParagraphs(): Promise<number> {
        return this.allParagraphs().count();
    }

    async countLinks(): Promise<number> {
        return this.allLinks().count();
    }

    async getPageContent(): Promise<string | null> {
        return this.body().textContent();
    }

    async isBodyVisible(): Promise<boolean> {
        return this.body().isVisible();
    }

    async waitForTitle(): Promise<void> {
        await this.title().waitFor({ state: 'visible', timeout: 5000 });
    }

    async isTitleVisible(): Promise<boolean> {
        return this.title().isVisible();
    }

    async isDescriptionVisible(): Promise<boolean> {
        return this.description().isVisible();
    }

    async isLinkVisible(): Promise<boolean> {
        return this.moreInfoLink().isVisible();
    }
}

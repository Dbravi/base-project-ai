import { Page, Locator } from '@playwright/test';

export class ExampleDomainPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly description: Locator;
    readonly moreLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading');
        this.description = page.locator('p').first();
        this.moreLink = page.locator('a');
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }
}

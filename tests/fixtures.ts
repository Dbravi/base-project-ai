import { test as base } from '@playwright/test';
import { ExampleDomainPage } from './ui/pages/example-domain.page';

type Fixtures = {
    examplePage: ExampleDomainPage;
};

export const test = base.extend<Fixtures>({
    examplePage: async ({ page }, use) => {
        const examplePage = new ExampleDomainPage(page);
        await examplePage.goto();
        await use(examplePage);
    },
});

export { expect } from '@playwright/test';

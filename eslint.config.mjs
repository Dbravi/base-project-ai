// @ts-check

import tseslint from 'typescript-eslint';
import playwrightPlugin from 'eslint-plugin-playwright';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    ...tseslint.configs.recommended,
    playwrightPlugin.configs['flat/recommended'],
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            // TypeScript customizations
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],

            // Stylistic customizations
            '@stylistic/lines-between-class-members': [
                'error',
                {
                    enforce: [{ blankLine: 'always', prev: 'method', next: 'method' }],
                },
            ],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/indent': ['error', 4],
        },
    },
    {
        ignores: ['eslint.config.mjs', 'playwright-report/', 'test-results/', 'node_modules/', 'dist/'],
    },
);

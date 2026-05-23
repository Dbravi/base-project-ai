import { APIRequestContext } from '@playwright/test';

export interface ApiResponse {
    status: number;
    body: unknown;
    headers: Record<string, string>;
}

export class ApiClient {
    readonly baseUrl: string;
    readonly apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext, baseUrl: string = '') {
        this.apiContext = apiContext;
        this.baseUrl = baseUrl;
    }

    async get(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse> {
        const response = await this.apiContext.get(`${this.baseUrl}${endpoint}`, options);
        const body = await response.json().catch(() => response.text());
        return {
            status: response.status(),
            body,
            headers: response.headers(),
        };
    }

    async post(endpoint: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<ApiResponse> {
        const response = await this.apiContext.post(`${this.baseUrl}${endpoint}`, {
            data,
            ...options,
        });
        const body = await response.json().catch(() => response.text());
        return {
            status: response.status(),
            body,
            headers: response.headers(),
        };
    }

    async put(endpoint: string, data?: unknown, options?: { headers?: Record<string, string> }): Promise<ApiResponse> {
        const response = await this.apiContext.put(`${this.baseUrl}${endpoint}`, {
            data,
            ...options,
        });
        const body = await response.json().catch(() => response.text());
        return {
            status: response.status(),
            body,
            headers: response.headers(),
        };
    }

    async patch(
        endpoint: string,
        data?: unknown,
        options?: { headers?: Record<string, string> },
    ): Promise<ApiResponse> {
        const response = await this.apiContext.patch(`${this.baseUrl}${endpoint}`, {
            data,
            ...options,
        });
        const body = await response.json().catch(() => response.text());
        return {
            status: response.status(),
            body,
            headers: response.headers(),
        };
    }

    async delete(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse> {
        const response = await this.apiContext.delete(`${this.baseUrl}${endpoint}`, options);
        const body = await response.json().catch(() => response.text());
        return {
            status: response.status(),
            body,
            headers: response.headers(),
        };
    }

    async head(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse> {
        const response = await this.apiContext.head(`${this.baseUrl}${endpoint}`, options);
        return {
            status: response.status(),
            body: null,
            headers: response.headers(),
        };
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    isStatusOk(status: number): boolean {
        return status >= 200 && status < 300;
    }

    isStatusError(status: number): boolean {
        return status >= 400;
    }

    isStatusRedirect(status: number): boolean {
        return status >= 300 && status < 400;
    }
}

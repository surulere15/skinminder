/**
 * SkinMinder API Client
 * Shared SDK used by Web, Mobile, and Widgets.
 */

export class SkinMinderClient {
    constructor(private apiKey: string) {}

    async startScan() {
        return fetch("/v1/user/scans/upload-url", {
            headers: { "Authorization": `Bearer ${this.apiKey}` }
        });
    }
}

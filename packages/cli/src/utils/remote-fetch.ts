import { EmptyCache, type IFileCache } from "./file-cache.js";

export interface HookEntry {
  description: string;
  name: string;
}

export interface Registry {
  hooks: HookEntry[];
}

class NotFoundError extends Error {
  constructor() {
    super();
    this.name = "NotFoundError";
  }
}

export class HooksFetcher {
  constructor(
    private branch = "main",
    private packageBase = "packages/hooks",
    private readonly cache: IFileCache = new EmptyCache(),
  ) {}

  async fetchHook(hookName: string): Promise<string> {
    const path = `/src/${hookName}/${hookName}.ts`;
    const cacheKey = `hook-${hookName}`;

    try {
      const content = await this.fetchFile(path, cacheKey);

      return content;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new Error(`Hook "${hookName}" not found.`);
      }
      throw error;
    }
  }

  async fetchHookTest(hookName: string): Promise<string> {
    const path = `/src/${hookName}/${hookName}.test.ts`;
    const cacheKey = `hook-test-${hookName}`;

    try {
      const content = await this.fetchFile(path, cacheKey);

      return content;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new Error(`Hook "${hookName}" testfile not found.`);
      }
      throw error;
    }
  }

  private async fetchFile(path: string, cacheKey: string) {
    const cached = await this.cache.getCache<string>(cacheKey);

    if (cached) {
      return cached;
    }

    const url = `${this.getGithubRawBase()}/${path}`;

    console.log("Fetching from URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError();
      }
      throw new Error(`Failed to fetch hook: ${response.statusText}`);
    }

    const content = await response.text();
    await this.cache.setCache(cacheKey, content);

    return content;
  }

  private getGithubRawBase() {
    return `https://raw.githubusercontent.com/leifarriens/airyhooks/${this.branch}/${this.packageBase}`;
  }
}

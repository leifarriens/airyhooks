import fs from "fs-extra";
import os from "node:os";
import path from "node:path";

const CACHE_DIR = path.join(os.homedir(), ".cache", "airyhooks");
const CACHE_TTL_MS = 1000 * 60 * 60;

export interface IFileCache {
  getCache<T>(key: string): Promise<null | T>;
  setCache(key: string, data: unknown): Promise<void>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class EmptyCache implements IFileCache {
  getCache<T>(): Promise<null | T> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }
  setCache(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export class FileCache implements IFileCache {
  constructor(
    private readonly ttl = CACHE_TTL_MS,
    private readonly cacheDir = CACHE_DIR,
  ) {}

  async getCache<T>(key: string): Promise<null | T> {
    try {
      const cachePath = this.getCachePath(key);

      if (!(await fs.pathExists(cachePath))) {
        return null;
      }

      const entry = (await fs.readJson(cachePath)) as CacheEntry<T>;
      const isExpired = Date.now() - entry.timestamp > this.ttl;

      if (isExpired) {
        await fs.remove(cachePath);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  async setCache(key: string, data: unknown): Promise<void> {
    try {
      await this.ensureCacheDir();
      const cachePath = this.getCachePath(key);
      const entry = { data, timestamp: Date.now() };
      await fs.writeJson(cachePath, entry);
    } catch {
      // Silently fail - caching is optional
    }
  }

  private async ensureCacheDir(): Promise<void> {
    await fs.ensureDir(this.cacheDir);
  }

  private getCachePath(key: string): string {
    return path.join(this.cacheDir, `${key}.json`);
  }
}

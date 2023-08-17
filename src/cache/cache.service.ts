import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache<T>(
    key: string,
    functionRequest: () => Promise<T>,
  ): Promise<T> {
    const dataCache: T = await this.cacheManager.get(key);

    if (dataCache) {
      return dataCache;
    }

    const data = await functionRequest();

    await this.cacheManager.set(key, data);

    return data;
  }

  async invalidateCache(key: string) {
    await this.cacheManager.del(key);
  }
}

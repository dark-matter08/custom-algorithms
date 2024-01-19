const { HashTable } = require('./hash-table');
const fs = require('fs');

class InMemoryCache {
  constructor(options) {
    return new Promise(async (resolve, reject) => {
      try {
        this.store = new HashTable();
        this.maxSize =
          options &&
          options.maxSize &&
          typeof options.maxSize === 'number' &&
          options.maxSize > 10
            ? options.maxSize
            : 127;
        this.currentSize = 0;
        this.ttl =
          options &&
          options.ttl &&
          typeof options.ttl === 'number' &&
          options.ttl > 1000
            ? options.ttl
            : 60000;
        this.strategy =
          options &&
          options.strategy &&
          (options.strategy === 'LRU' || options.strategy === 'LFU')
            ? options.strategy
            : 'LRU';
        this.isPersisting =
          options &&
          options.isPersisting &&
          typeof options.isPersisting === 'boolean'
            ? true
            : false;
        this.storagePath = './files/cache.json';

        if (this.isPersisting) {
          await this._loadPersistedData();
        }

        this.cleanupInterval = null;

        if (
          options &&
          options.cleanupInterval &&
          typeof options.cleanupInterval === 'number' &&
          options.cleanupInterval > 0
        ) {
          this._scheduleCleanup(options.cleanupInterval);
        }

        resolve(this);
      } catch (error) {
        reject(error);
      }
    });
  }

  async set(key, value, ttl) {
    return await this._set(key, value, ttl);
  }

  async get(key, cacheMissCallBack) {
    const item = await this._get(key);

    if (!item) {
      return await this._handleCacheMiss(key, cacheMissCallBack);
    }

    return item;
  }

  async delete(key) {
    return await this._delete(key);
  }

  _clearCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  _scheduleCleanup(interval) {
    this._clearCleanupInterval();

    this.cleanupInterval = setInterval(() => {
      this._cleanupExpiredItems();
    }, interval);
  }

  _evictLRU() {
    let oldestKey;
    let oldestTimestamp = Infinity;
    this.store.keys().forEach((key) => {
      const value = this.store.get(key);

      if (value.createdAt < oldestTimestamp) {
        oldestKey = key;
        oldestTimestamp = value.createdAt;
      }
    });

    this.delete(oldestKey);
  }

  _evictLFU() {
    let leastFrequentKey;
    let leastFrequentCount = Infinity;
    this.store.keys().forEach((key) => {
      const value = this.store.get(key);

      if (value.frequency < leastFrequentCount) {
        leastFrequentKey = key;
        leastFrequentCount = value.frequency;
      }
    });

    this.delete(leastFrequentKey);
  }

  async _delete(key) {
    this.store.remove(key);

    await this._persistData();
  }

  async _set(key, value, ttl) {
    if (this.currentSize >= this.maxSize) {
      this._evictItem();
    }

    const item = {
      value,
      createdAt: Date.now(),
      ttl: ttl ? ttl : this.ttl,
      frequency: 0,
    };

    this.store.set(key, item);
    this.currentSize++;
    await this._persistData();
  }

  async _get(key) {
    let item = this.store.get(key);

    if (item) {
      this._updateFrequency(key);
    }

    return item ? item.value : item;
  }

  async _handleCacheMiss(key, callback) {
    if (callback) {
      const value = callback();

      await this.set(key, value);
      return await this._get(key);
    }

    return undefined;
  }

  async _persistData() {
    if (this.isPersisting) {
      await fs.promises.writeFile(
        this.storagePath,
        JSON.stringify(this.store.display()),
        'utf8',
        'w'
      );
    }
  }

  async _loadPersistedData() {
    try {
      const storedData = await fs.promises.readFile(this.storagePath, 'utf8');
      if (storedData) {
        for (const key in JSON.parse(storedData)) {
          const value = JSON.parse(storedData)[key];
          this.store.set(key, value);
        }
      }
    } catch (err) {
      console.log('An error occurred trying to load cache data ===>', err);
    }
  }

  async _evictItem() {
    if (this.strategy === 'LRU') {
      this._evictLRU();
    }
    if (this.strategy === 'LFU') {
      this._evictLFU();
    }
  }

  async _updateFrequency(key) {
    const item = this.store.get(key);
    if (item) {
      item.frequency = (item.frequency || 0) + 1;
    }

    this._persistData();
  }

  async _cleanupExpiredItems() {
    const now = Date.now();
    this.store.keys().forEach((key) => {
      const item = this.store.get(key);
      if (item.createdAt + item.ttl < now) {
        this.delete(key);
      }
    });
  }
}

module.exports = { InMemoryCache };

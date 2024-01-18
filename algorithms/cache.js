const { HashTable } = require('./hash-table');
const fs = require('fs');

class InMemoryCache {
  constructor(maxSize, ttl, strategy, isPersisting) {
    return new Promise((resolve, reject) => {
      this.store = new HashTable();
      this.maxSize =
        typeof maxSize === 'number' && maxSize > 10 ? maxSize : 127;
      this.currentSize = 0;
      this.ttl = typeof ttl === 'number' && ttl > 1000 ? ttl : 60000;
      this.strategy =
        strategy === 'LRU' || strategy === 'LFU' ? strategy : 'LRU';
      this.isPersisting = typeof isPersisting === 'boolean' ? true : false;
      this.storagePath = './files/cache.json';

      if (this.isPersisting) {
        this._loadPersistedData();
      }
    });
  }

  set(key, value, ttl) {
    return this._set(key, value, ttl);
  }

  get(key) {
    const item = this.store.get(key);

    if (item) {
      this._updateFrequency(key);
    }
    return item;
  }

  delete(key) {
    return this.store.remove(key);
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

    if (this.isPersisting) {
      Atomics.store(this.currentSize, 0, Atomics.load(this.currentSize, 0) + 1);
      await fs.promises.writeFile(
        this.storagePath,
        JSON.stringify(this.store.display()),
        'utf8',
        'w'
      );
    }
  }

  _timeCleanup() {
    if (!this.cleanupInterval && ttl) {
      this.cleanupInterval = setTimeout(() => {
        this._cleanupExpiredItems();
        this.cleanupInterval = null; // Reset cleanupInterval after running once
      }, ttl);
    }
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
  }

  async _cleanupExpiredItems() {
    const now = Date.now();
    this.cache.keys().forEach((key) => {
      if (this.store.get(key).createdAt + this.store.get(key).ttl < now) {
        this.delete(key);
      }
    });
  }
}

module.exports = { InMemoryCache };

class HashTable {
  constructor() {
    this.table = new Array(127);
    this.size = 0;
  }

  set(key, value) {
    this._set(key, value);
  }

  get(key) {
    const linkedList = this._get(key);
    if (!linkedList) {
      return undefined;
    }

    return linkedList;
  }

  remove(key) {
    const index = this._hash(key);
    const targetItem = this.table[index];

    if (targetItem) {
      for (let i = 0; i < targetItem.length; i++) {
        if (targetItem[i][0] === key) {
          targetItem.splice(i, 1);
          this.size--;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  display() {
    let returnDisplay = '{';
    this.table.forEach((values, index) => {
      const chainedValues = values.map(
        ([key, value]) =>
          `"${key}": ${
            typeof value === 'number' ? value : JSON.stringify(value)
          }${index + 1 !== this.size && ','}`
      );
      returnDisplay = returnDisplay + `\n  ${chainedValues}`;
    });
    returnDisplay = returnDisplay.endsWith(',')
      ? returnDisplay.slice(0, -1)
      : returnDisplay;

    returnDisplay = returnDisplay + '\n}';

    return JSON.parse(returnDisplay);
  }

  keys() {
    const keys = [];
    this.table.forEach((values, _index) => {
      values.map(([key, _value]) => keys.push(key));
    });

    return keys;
  }

  values() {
    const values = [];
    this.table.forEach((vals, _index) => {
      vals.map(([_key, value]) => values.push(value));
    });

    return values;
  }

  forEach(callback) {
    return this._loop(callback);
  }

  map(callback) {
    return this._loop(callback);
  }

  _hash(key) {
    let hash = 0;
    const prime = 31;

    if (typeof key === 'number') {
      key = String(key);
      hash = 1;
    }

    for (let i = 0; i < key.length; i++) {
      const charCode = key.charCodeAt(i);
      hash = (hash * prime + charCode + i) % this.table.length;
    }

    if (this._getLoadFactor() > 0.7) {
      this._resize();
    }

    return hash;
  }

  _set(key, value) {
    const index = this._hash(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        // Find the key/value pair in the chain
        if (this.table[index][i][0] === key) {
          this.table[index][i][1] = value;
          return;
        }
      }
      // not found, push a new key/value pair
      this.table[index].push([key, value]);
    } else {
      this.table[index] = [];
      this.table[index].push([key, value]);
    }
    this.size++;
  }

  _get(key) {
    const index = this._hash(key);
    const targetList = this.table[index];
    if (targetList) {
      for (let i = 0; i < targetList.length; i++) {
        if (targetList[i][0] === key) {
          return targetList[i][1];
        }
      }
    }
    return undefined;
  }

  _getLoadFactor() {
    return this.size / this.table.length;
  }

  _loop(callback) {
    for (const chain of this.table) {
      if (chain) {
        for (const [key, value] of chain) {
          callback(key, value);
        }
      }
    }
  }

  async _resize() {
    const newSize = this.table.length * 2;
    const newTable = new Array(newSize);

    for (const chain of this.table) {
      if (chain) {
        for (const [key, value] of chain) {
          const newIndex = this._hash(key);
          if (!newTable[newIndex]) {
            newTable[newIndex] = [];
          }
          newTable[newIndex].push([key, value]);
        }
      }
    }

    this.table = newTable;
  }
}

module.exports = { HashTable };

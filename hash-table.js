class HashTable {
  constructor(size = 10) {
    this.table = new Array(size);
  }

  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.table.length;
  }

  set(key, value) {
    const index = this._hash(key);
    this.table[index] = [key, value];
  }

  get(key) {
    const index = this._hash(key);
    return this.table[index][1];
  }
}

// Testing it works

const m = new HashTable(2);
m.set('a', 1);
m.set('b', 2);
m.set('c', 3);
console.log(m.table);
const v = m.get('a');
console.log(v);
console.log(1 == v);

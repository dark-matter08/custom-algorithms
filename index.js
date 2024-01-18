const { InMemoryCache } = require('./algorithms/cache');
const { HashTable } = require('./algorithms/hash-table');

function testingHashTables() {
  console.log('=============== Testing HashTable ==================');
  const m = new HashTable(10);
  m.set('abc', 'hello world');
  m.set('b', 1);
  // this to test if table size is ensured
  m.set('bca', 3);
  m.set(31, 3);
  m.set(13, 3);
  console.log(m.remove(13));

  console.log(m.display());

  const v = m.get('b');
  console.log(v);
  console.log(m.keys());
  console.log(m.values());
  console.log(1 == v);
}

async function testingCache() {
  console.log('=============== Testing Cache ==================');
  const cache = await new InMemoryCache(null, null, null, false);

  //   cache.set('nice', 'girl', 2000);
  //   cache.set('nice2', 'girl', 3000);
  //   setTimeout(() => {
  //     cache.set('nice2', 'boy');
  //   }, 3000);

  //   setTimeout(() => {
  //     console.log(cache.get('nice'));
  //     console.log(cache.get('nice'));
  //     console.log(cache.get('nice2'));
  //     console.log(cache.get('nice2'));
  //   }, 5000);

  //   setTimeout(() => {
  //     cache._evictItem();
  //   }, 20000);

  setTimeout(() => {
    console.log(cache.get('nice'));
  }, 3000);
}

// testingHashTables();
testingCache();

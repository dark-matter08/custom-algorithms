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
  try {
    const cache = await new InMemoryCache(null, null, null, true);
    console.log(await cache.get('nice'));
    cache.set('nice', 'girl boy at 700 hexagon drive', 2000);
    cache.set('nice2', 'bringing the drip down to size', 3000);

    console.log(await cache.get('nice'));
    console.log(await cache.get('nice2'));

    //   setTimeout(() => {
    //     cache._evictItem();
    //   }, 20000);
    //   console.log(await cache.get('nice'));
    //   setTimeout(() => {
    //     console.log(cache.get('nice'));
    //   }, 3000);
  } catch (error) {
    console.log('Error initializing cache: ', error);
  }
}

// testingHashTables();
testingCache();

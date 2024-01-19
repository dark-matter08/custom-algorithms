const { InMemoryCache } = require('../algorithms/cache');
let testCount = 0;
let passCount = 0;
let failedCount = 0;

function failed(message, space) {
  console.log(space, '\x1b[31m====> Test Failed:\x1b[0m', message);
}

function success(message, space) {
  console.log(
    space,
    '\x1b[32m====> Test Passed\x1b[0m',
    message ? ': ' + message : ''
  );
}

function info(message, space) {
  console.log(space, `\x1b[36m${message}\x1b[0m`);
}
function infoSuccess(message, space) {
  console.log(space, `\x1b[32m${message}\x1b[0m`);
}
function infoFailed(message, space) {
  console.log(space, `\x1b[31m${message}\x1b[0m`);
}

function heading(message) {
  console.log(`\x1b[35m${message}\x1b[0m`);
}

async function settingValues() {
  info('1. Setting Value', '');
  testCount = testCount + 1;
  try {
    const cache = await new InMemoryCache();
    await cache.set('key1', 'value1');
    const value = await cache.get('key1');
    if (value !== 'value1') {
      throw new Error('Cache did not store value correctly');
    } else {
      success('', '');
      passCount = passCount + 1;
    }
  } catch (error) {
    failedCount = failedCount + 1;
    failed(error.message, '');
  }
}

async function retrievingValues() {
  info('2. Retrieving Value', '');
  try {
    info('2.1. Retrieves values for a an existing key', '    ');
    testCount = testCount + 1;
    const cache = await new InMemoryCache();
    await cache.set('key2', 'value2');
    const value2 = await cache.get('key2');
    if (value2 !== 'value2') {
      throw new Error('Cache did not store value correctly');
    } else {
      success('', '        ');
      passCount = passCount + 1;
    }
  } catch (error) {
    failedCount = failedCount + 1;
    failed(error.message, '        ');
  }

  try {
    info("2.2. Returns 'undefined' for a non-existent key", '    ');
    testCount = testCount + 1;
    const cache = await new InMemoryCache();
    const value3 = await cache.get('key3');
    if (value3 !== undefined) {
      throw new Error('Returns value for non existent : key3 as ', value3);
    } else {
      passCount = passCount + 1;
      success('', '        ');
    }
  } catch (error) {
    failedCount = failedCount + 1;
    failed(error.message, '        ');
  }
}

async function evictionStrategies() {
  info('3. Eviction Strategies', '');
  try {
    info('3.1. Evicts the least recently used item (LRU)', '    ');
    testCount = testCount + 2;
    const cache = await new InMemoryCache(0, 0, 'LRU', false);
    await cache.set('key1', 'value1');
    await cache.set('key2', 'value2');

    await cache._evictItem();
    const value = await cache.get('key1');
    const value2 = await cache.get('key2');
    if (value !== undefined) {
      failedCount = failedCount + 1;
      failed('Expecting value at key 1 to be non existent', '        ');
    } else {
      passCount = passCount + 1;
      success('Key 1, removed', '        ');
    }
    if (value2 !== 'value2') {
      failedCount = failedCount + 1;
      failed('Expecting a value to still exist in key 2', '        ');
    } else {
      passCount = passCount + 1;
      success('Key 2, still exists', '        ');
    }
  } catch (error) {
    failedCount = failedCount + 2;
    failed(error.message, '        ');
  }

  try {
    info('3.2. Evicts the least frequently used item (LFU)', '    ');
    testCount = testCount + 2;
    const cache = await new InMemoryCache(0, 0, 'LFU', false);
    await cache.set('key1', 'value1');
    await cache.set('key2', 'value2');

    await cache.get('key1');
    await cache.get('key1');
    await cache.get('key2');

    await cache._evictItem();
    const value = await cache.get('key1');
    const value2 = await cache.get('key2');
    if (value !== 'value1') {
      failedCount = failedCount + 1;
      failed('Expecting a value to still exist in key 1', '        ');
    } else {
      passCount = passCount + 1;
      success('Key 1, still exists', '        ');
    }
    if (value2 !== undefined) {
      failedCount = failedCount + 1;
      failed('Expecting value at key 2 to be non existent', '        ');
    } else {
      passCount = passCount + 1;
      success('Key 2, removed', '        ');
    }
  } catch (error) {
    failedCount = failedCount + 2;
    failed(error.message, '        ');
  }
}

async function persistingValues() {
  info('4. Persisting cached data', '');
  testCount = testCount + 2;
  try {
    info('4.1. Saves cached data to a file', '    ');
    const cache = await new InMemoryCache(0, 0, 'LRU', true);
    await cache.set('key4', 'value4');
    await cache.set('key5', 'value5');
    success('', '        ');
    passCount = passCount + 1;
  } catch (error) {
    failedCount = failedCount + 1;

    failed(
      'Error Writing to memory for persistence' + error.message,
      '        '
    );
  }

  try {
    info('4.2. Loads cached data from a file', '    ');
    const cache = await new InMemoryCache(0, 0, 'LRU', true);
    const value4 = await cache.get('key4');
    const value5 = await cache.get('key5');

    if (value4 !== 'value4' || value5 !== 'value5') {
      throw new Error(
        'Expecting values of key4 and key5 to value4 and value5 respectively',
        '        '
      );
    } else {
      passCount = passCount + 1;
      success('', '        ');
    }
  } catch (error) {
    failedCount = failedCount + 1;
    failed(error.message, '        ');
  }
}

async function handlingCacheMiss() {
  info('5. Handle cache miss', '');
  testCount = testCount + 2;
  try {
    info(
      '5.1. Expecting two cache miss, one not handled and one handled',
      '    '
    );
    const cache = await new InMemoryCache(0, 0, 'LRU', false);
    value7 = await cache.get('key7');
    value8 = await cache.get('key8', () => 'value8');

    if (value7 !== undefined) {
      failedCount = failedCount + 1;
      failed('Expecting value at key 7 to be non existent', '        ');
    } else {
      passCount = passCount + 1;
      success('key7 returns undefined', '        ');
    }
    if (value8 !== 'value8') {
      failedCount = failedCount + 1;
      failed('An error occurred: ' + value8, '        ');
    } else {
      passCount = passCount + 1;
      success('Key 8, returning: ' + value8, '        ');
    }
  } catch (error) {
    failedCount = failedCount + 2;

    failed(
      'Error Writing to memory for persistence' + error.message,
      '        '
    );
  }
}

async function testCache() {
  heading('Testing custom in-memory cache/store');
  try {
    await settingValues();
    await retrievingValues();
    await evictionStrategies();
    await persistingValues();
    await handlingCacheMiss();

    info('=====================================================', '');
    info('=> Total : ' + testCount, '');
    infoSuccess('=> Passed: ' + passCount, '');
    infoFailed('=> Failed: ' + failedCount, '');
    info('=====================================================', '');
    if (passCount === testCount) {
      success('All tests passed! <====', '');
    }
  } catch (error) {
    failed(error.message);
  }
}

testCache();

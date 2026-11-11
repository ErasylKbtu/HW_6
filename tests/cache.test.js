import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readCached, invalidateCache } from '../src/services/cache.js';

beforeEach(() => invalidateCache());

test('reads reuse fresh entries, isolate resource keys, and return safe copies', async () => {
  let calls = 0;
  const load = async () => { calls += 1; return { title: 'Original' }; };
  await readCached(['assignments', 'detail', 'one'], load);
  const cached = await readCached(['assignments', 'detail', 'one'], load);
  cached.title = 'Changed outside API';
  assert.equal((await readCached(['assignments', 'detail', 'one'], load)).title, 'Original');
  assert.equal(calls, 1);
  await readCached(['assignments', 'detail', 'two'], load);
  assert.equal(calls, 2);
});

test('expired results are revalidated on the next read', async () => {
  let calls = 0;
  const load = async () => ++calls;
  await readCached(['assignments', 'list'], load, { ttl: -1 });
  assert.equal(await readCached(['assignments', 'list'], load), 2);
});

test('failures are not cached and retry can succeed', async () => {
  await assert.rejects(readCached(['assignments'], async () => { throw new Error('offline'); }));
  assert.equal(await readCached(['assignments'], async () => 'recovered'), 'recovered');
});

test('invalidation prevents an older in-flight response from refilling the cache', async () => {
  let finish;
  const pending = readCached(['assignments', 'list'], () => new Promise((resolve) => { finish = resolve; }));
  invalidateCache(['assignments']);
  await readCached(['assignments', 'list'], async () => ['new']);
  finish(['old']);
  await pending;
  assert.deepEqual(await readCached(['assignments', 'list'], async () => ['unexpected']), ['new']);
});

test('a slower request cannot overwrite a newer successful response', async () => {
  let finish;
  const pending = readCached(['assignments', 'list'], () => new Promise((resolve) => { finish = resolve; }));
  await readCached(['assignments', 'list'], async () => 'new');
  finish('old');
  await pending;
  assert.equal(await readCached(['assignments', 'list'], async () => 'unexpected'), 'new');
});

test('aborted consumers do not receive or cache results', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(readCached(['assignments'], async () => 'ignored', { signal: controller.signal }), { name: 'AbortError' });
});

test('prefix invalidation clears related reads and preserves unrelated resources', async () => {
  await readCached(['assignments', 'list'], async () => 1);
  await readCached(['other'], async () => 2);
  invalidateCache(['assignments']);
  assert.equal(await readCached(['assignments', 'list'], async () => 3), 3);
  assert.equal(await readCached(['other'], async () => 4), 2);
});

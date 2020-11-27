// https://developers.google.com/web/fundamentals/primers/service-workers#cache_and_return_requests
// https://jakearchibald.com/2014/offline-cookbook/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 3;
const CACHE_NAME = "v7";

// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

self.addEventListener('install', (event) => {
  console.log('install');
  event.waitUntil(async function () {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      '/'
    ]);
  }());
});

self.addEventListener('activate', (event) => {
  // it's a good time to handle schema migrations in
  // IndexedDB and also delete unused caches.
  console.log('activate');
  event.waitUntil(async function () {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter((cacheName) => {
        console.log('activate '+cacheName);
        // Return true if you want to remove this cache,
        // but remember that caches are shared across
        // the whole origin
        return true;//cacheName !== CACHE_NAME;
      }).map(cacheName => caches.delete(cacheName))
    );
  }());
});

self.addEventListener('fetch', (event) => {
  console.log('fetch ' + event.request);
  // A sensible default pattern
  event.respondWith(async function () {
    const cachedResponse = await caches.match(event.request);
    return cachedResponse || fetch(event.request);
  }());
});
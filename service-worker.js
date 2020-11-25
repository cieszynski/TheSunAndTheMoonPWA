// https://developers.google.com/web/fundamentals/primers/service-workers#cache_and_return_requests
// https://jakearchibald.com/2014/offline-cookbook/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

self.addEventListener('install', (event) => {
  event.waitUntil(async function () {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
    ]);
  }());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter((cacheName) => {
        console.log(cacheName);
        // Return true if you want to remove this cache,
        // but remember that caches are shared across
        // the whole origin
      }).map(cacheName => caches.delete(cacheName))
    );
  }());
});

self.addEventListener('fetch', (event) => {
  // A sensible default pattern
  event.respondWith(async function () {
    const cachedResponse = await caches.match(event.request);
    return cachedResponse || fetch(event.request);
  }());
});
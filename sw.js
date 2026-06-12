const CACHE_NAME = 'examprep-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/timer.js',
  '/js/checklist.js',
  '/js/scores.js',
  '/js/timetable.js',
  '/payload.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if found, else fetch from network
      return cachedResponse || fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

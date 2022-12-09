const pushPageCache = [
  'favicon.ico',
  'icons/512.png',
  'index.js',
  '/',
  'index.html',
];

const cacheName = 'pushPageCache';

self.addEventListener('install', (event) => {
  console.log('installing', event);
  event.waitUntil(self.skipWaiting());
  const preCache = async () => {
    const cache = await caches.open(cacheName);
    return cache.addAll(pushPageCache);
  }
  event.waitUntil(preCache());
});

self.addEventListener('activate', (event) => {
  console.log('activating', event);
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.log('fetch', event);
  const requestUrl = new URL(event.request.url);
  const path = requestUrl.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);

  if (filename === 'sw.js' || event.request.url.includes('chrome-extension:')) {
    return event.respondWith(fetch(event.request));
  }

  return event.respondWith(cacheFirstStrategy(event.request));
});

const cacheFirstStrategy = async (request) => {
  const cacheResponse = await caches.match(request);
  console.log('cache response', cacheResponse);
  return cacheResponse || fetchRequestAndCache(request);
};

const fetchRequestAndCache = async (request) => {
  const networkResponse = await fetch(request);
  const clonedResponse = networkResponse.clone();
  const cache = await caches.open(cacheName);
  cache.put(request, networkResponse);
  return clonedResponse;
};

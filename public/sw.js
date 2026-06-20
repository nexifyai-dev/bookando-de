/* Bookando Service Worker v1.0.0 */
const CACHE = {
  static: 'bookando-static-v1',
  api: 'bookando-api-v1',
  pages: 'bookando-pages-v1',
};

const STATIC_EXT = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|json)$/;
const API_PATH = /^\/api\//;

/* ---- Install: pre-cache shell ---- */
self.addEventListener('install', (ev) => {
  self.skipWaiting();
  ev.waitUntil(
    caches.open(CACHE.static).then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
      ]).catch(() => {/* offline first start */})
    )
  );
});

/* ---- Activate: prune old caches ---- */
self.addEventListener('activate', (ev) => {
  const keep = new Set(Object.values(CACHE));
  ev.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !keep.has(k) && k.startsWith('bookando-'))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---- Fetch strategies ---- */
self.addEventListener('fetch', (ev) => {
  const { request } = ev;
  const url = new URL(request.url);

  /* Same-origin only */
  if (url.origin !== self.location.origin && !url.origin.includes('bookando')) {
    return;
  }

  /* API calls: network-first */
  if (url.origin === self.location.origin && API_PATH.test(url.pathname)) {
    ev.respondWith(networkFirst(request, CACHE.api));
    return;
  }

  /* Static assets: cache-first */
  if (STATIC_EXT.test(url.pathname)) {
    ev.respondWith(cacheFirst(request, CACHE.static));
    return;
  }

  /* Navigation requests: network-first with offline fallback */
  if (request.mode === 'navigate') {
    ev.respondWith(networkFirst(request, CACHE.pages));
    return;
  }

  /* Everything else: network-only */
});

/* ---- Strategies ---- */

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match('/');
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      /* Don't cache POST/PUT/DELETE */
      if (request.method === 'GET') {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    /* For API calls that fail and have no cache, return a structured error */
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ error: 'offline', message: 'Du bist offline. Bookando funktioniert nur eingeschränkt.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return caches.match('/');
  }
}

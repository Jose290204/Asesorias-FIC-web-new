// Service worker mínimo: hace instalable la PWA y muestra una pantalla propia sin conexión.
// No guarda en caché la API ni datos de sesión: sólo la página de "sin conexión".
const CACHE = 'asesorias-fic-offline-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Sólo se interceptan las navegaciones (abrir la app o recargar). Todo lo demás va directo a la red.
  if (request.mode !== 'navigate') return;

  event.respondWith(
    (async () => {
      try {
        return await fetch(request);
      } catch {
        // Un reintento corto antes de rendirse (los túneles a veces fallan la primera vez)
        try {
          await new Promise((r) => setTimeout(r, 800));
          return await fetch(request);
        } catch {
          const cache = await caches.open(CACHE);
          return (await cache.match(OFFLINE_URL)) || Response.error();
        }
      }
    })()
  );
});

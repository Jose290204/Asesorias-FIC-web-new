// Service worker mínimo: hace instalable la PWA y muestra una pantalla propia sin conexión.
// No guarda en caché la API ni datos de sesión: sólo la página de "sin conexión".
const CACHE = 'asesorias-fic-offline-v4';
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

// --- Avisos push ---
// El backend manda { title, body, icon, tag, data: { url } }; aquí se muestran como notificación del sistema.
self.addEventListener('push', (event) => {
  let datos;
  try {
    datos = event.data ? event.data.json() : {};
  } catch {
    datos = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(
    self.registration.showNotification(datos.title || 'Asesorías FIC', {
      body: datos.body,
      icon: datos.icon || '/icons/icon-192.png',
      // Ícono chico de la barra de estado: Android solo usa la silueta (blanco con transparencia)
      badge: '/icons/badge-96.png',
      tag: datos.tag,
      data: datos.data || {},
    })
  );
});

// Al tocar el aviso: si la app ya está abierta se le manda el destino (ella navega con su router);
// si está cerrada se abre con el destino en la dirección (?aviso=...) y la app lo lee al arrancar.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const datos = event.notification.data || {};

  event.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

      // App ya abierta (primer plano o segundo plano): se le avisa y se trae al frente
      if (ventanas.length > 0) {
        const ventana = ventanas.find((v) => 'focus' in v) || ventanas[0];
        ventana.postMessage({ tipo: 'push-abrir', datos });
        return ventana.focus();
      }

      // App cerrada: se abre una ventana nueva con el aviso en la direccion
      return self.clients.openWindow('/?aviso=' + encodeURIComponent(JSON.stringify(datos)));
    })()
  );
});

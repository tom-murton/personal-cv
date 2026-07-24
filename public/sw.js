/*
 * Retirement worker for the portfolio's former PWA.
 *
 * Keep this file available at /sw.js while older visitors may still have the
 * retired offline worker registered. It replaces that worker, removes its
 * caches, unregisters itself and reloads controlled tabs onto the live site.
 */

self.addEventListener("install", () => {
  void self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      await self.clients.claim();

      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      await self.registration.unregister();
      await Promise.all(
        windowClients.map((client) => client.navigate(client.url)),
      );
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

/* Service worker mínimo de la propuesta Pausa.
   Sirve para dos cosas: que Chrome en Android ofrezca «Instalar aplicación»
   y que la página abra aunque no haya señal por un momento.
   Siempre pide primero a la red (así los cambios de la web se ven al instante)
   y usa la copia guardada solo si no hay conexión.
   Los CSV de sellos NUNCA se guardan: los sellos deben ser los del momento. */
var VERSION = "pausa-v1";
var SHELL = [
  "./puntos.html",
  "./assets/css/base.css",
  "./assets/js/config.js",
  "./assets/js/main.js",
  "./assets/js/puntos.js",
  "./assets/icons/icon-192.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Google Sheets, WhatsApp, Maps: directo a la red
  if (/\.csv$/i.test(url.pathname)) return;           // sellos de prueba: sin caché

  e.respondWith(
    fetch(req)
      .then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || (req.mode === "navigate" ? caches.match("./puntos.html") : Response.error());
        });
      })
  );
});

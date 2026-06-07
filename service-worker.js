const CACHE_NAME = "velocity-app-v43;

const urlsToCache = [
  "./",
  "./index.html",
  "./historial.html",
  "./manifest.json",
  "./icon.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = event.request.url;
  if(url.includes('firestore.googleapis.com') ||
     url.includes('firebase') ||
     url.startsWith('blob:') ||
     url.startsWith('chrome-extension') ||
     event.request.method !== 'GET'){
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => caches.match("./index.html"));
      })
  );
});







let cacheName = 'test-site'
let filesToCache = [
  // '/',
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  )
})

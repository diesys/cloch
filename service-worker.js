// Cache names
var dataCacheName = 'CLOCHData-v0.6.0'
var cacheName = 'clochPWA-0.6'
// Application shell files to be cached
var filesToCache = [
    '/',
    '/index.html',
    '/js/cloch.min.js',
    '/js/jquery.min.js',
    '/js/jquery-ui-1.12.1.custom/jquery-ui.min.js',
    '/js/TweenMax.min.js',
    '/css/cloch.min.css',
    '/img/favicon.png'
]
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install')
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell')
            return cache.addAll(filesToCache)
        })
    )
})
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate')
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key)
                    return caches.delete(key)
                }
            }))
        })
    )
    return self.clients.claim()
})
self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request)
        })
    )
})
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_URLS);
        }).then(() => self.skipWaiting())
    );
});
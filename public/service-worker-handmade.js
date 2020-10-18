/* eslint-disable no-undef */
// Set this to true for production
var doCache = false;

// Name our cache
var CACHE_NAME = 'echat-cache-v1';

// Cache files
var appShellFilesToCache = [
    './index.html',
    './bundle.js',
    './email-chat-logo.png',
    './favicon.ico',
];

// Delete old caches that are not our current one!
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
            caches.keys()
                .then(keyList =>
                        Promise.all(keyList.map(key => {
                            if (!cacheWhitelist.includes(key)) {
                                console.log('Deleting cache: ' + key)
                                return caches.delete(key);
                            }
                        }))
                )
    );
});

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', (event) => {
    if (doCache) {
        self.skipWaiting()
        console.log('[Service Worker]: Installed')

        event.waitUntil(
            caches.open(cacheName).then((cache) => {
                console.log('[Service Worker]: Caching App Shell')
                return cache.addAll(appShellFilesToCache)
            })
        )
    }
})

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener('fetch', function(event) {
    if (doCache) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});

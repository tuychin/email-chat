/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Turn on logging
workbox.setConfig({
    debug: false
});

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();



// PRECACHING

// Auto cache
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// // Google fonts cache
// workbox.routing.registerRoute(
//     new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
//     new workbox.strategies.StaleWhileRevalidate({
//         cacheName: 'googleapis',
//         plugins: [
//             new workbox.expiration.Plugin({
//                 maxEntries: 30
//             })
//         ]
//     })
// );

// // API with network-first strategy
// workbox.routing.registerRoute(
//     /(http[s]?:\/\/)?([^\/\s]+\/)api-example1/,
//     workbox.strategies.networkFirst()
// )

// // API with cache-first strategy
// workbox.routing.registerRoute(
//     /(http[s]?:\/\/)?([^\/\s]+\/)api-example2/,
//     workbox.strategies.cacheFirst()
// )



// OTHER EVENTS

// Receive push and show a notification
self.addEventListener('push', function(event) {
    console.log('[Service Worker]: Received push event', event);
});

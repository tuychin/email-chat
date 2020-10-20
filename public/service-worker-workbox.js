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

// On receive push and show a notification
self.addEventListener('push', function(event) {
    let notificationData = {};
    
    try {
        notificationData = event.data.json();
    } catch (e) {
        notificationData = {
            title: 'EChat',
            body: 'Вам пришло сообщение',
            icon: './assets/icon-192x192.png'
        };
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.custom.a.custom_data,
            icon: './assets/icon-192x192.png',
        })
    );
});

// On notification click
self.addEventListener('notificationclick', function(event) {
    // close the notification
    event.notification.close();
    // see if the current is open and if it is focus it
    // otherwise open new tab
    event.waitUntil(
        self.clients.matchAll().then(function(clientList) {
        
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            
            return self.clients.openWindow('/');
        })
    );
});

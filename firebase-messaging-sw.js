const staticCacheName = 'static-pwa-cache';
const dynamicCacheName = 'dynamic-pwa-cache';

const staticAssets = [
    './',
    './index.html',
    './bundle.js',
    './manifest.json',
    './assets/favicon.ico',
    './assets/icon-192x192.png',
    './assets/icon-256x256.png',
    './assets/icon-384x384.png',
    './assets/icon-512x512.png',
];

// SW ON INSTALL
self.addEventListener('install', async (event) => {
    event.waitUntil(self.skipWaiting());

    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets)
    console.log('Service worker has been installed');
});

// SW ON ACTIVATE
self.addEventListener('activate', async (event) => {
    // Controll all app tabs
    event.waitUntil(self.clients.claim());

    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (![staticCacheName, dynamicCacheName].includes(key)) {
            await caches.delete(key);
        }
    });

    // eslint-disable-next-line no-undef
    await Promise.all(checkKeys);
    console.log('Service worker has been activated');
});

// SW ON ANY REQUEST
self.addEventListener('fetch', event => {
    console.log(`Trying to fetch ${event.request.url}`);
    event.respondWith(checkCache(event.request));
});

// SW CACHE FIRST STRATEGY
async function checkCache(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);

    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());

        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);

        if (cachedRes) {
            return cachedRes;
        }
    }
}

// SW WEB PUSH NOTIFICATION
self.addEventListener('push', (event) => {
    let notificationData = {};

    try {
        notificationData = event.data.json();
    } catch (e) {
        notificationData = {
            title: 'EChat',
            body: 'Вам пришло сообщение',
            icon: 'assets/icon-192x192.png'
        };
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon
        })
    );
});

// On notification click
self.addEventListener('notificationclick', (event) => {
    // close the notification
    event.notification.close();
    // see if the current is open and if it is focus it
    // otherwise open new tab
    event.waitUntil(
        self.clients.matchAll().then((clientList) => {
        
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            
            return self.clients.openWindow('/');
        })
    );
});

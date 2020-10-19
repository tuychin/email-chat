const staticCacheName = 'static-cache-v0';
const dynamicCacheName = 'dynamic-cache-v0';

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

self.addEventListener('install', async () => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    console.log('Service worker has been installed');
});

self.addEventListener('activate', async () => {
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

self.addEventListener('fetch', event => {
    console.log(`Trying to fetch ${event.request.url}`);
    event.respondWith(checkCache(event.request));
});

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

// On receive push and show a notification
self.addEventListener('push', function(event) {
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

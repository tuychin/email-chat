/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */

// WORKBOX PRECACHING
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Turn on logging
workbox.setConfig({
    debug: false
});

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Auto cache injected WB_MANIFEST from webpack.config
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache-first strategy
workbox.routing.registerRoute(/(http[s]?:\/\/)?([^\/\s]+\/)/, workbox.strategies.cacheFirst());



// FCM WEB PUSH NOTIFICATION
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyC7Xblmorl6POclj6xzQI_-WrlCLFO7CYE',
  authDomain: 'my-chat-c4f16.firebaseapp.com',
  databaseURL: 'https://my-chat-c4f16.firebaseio.com',
  projectId: 'my-chat-c4f16',
  storageBucket: 'my-chat-c4f16.appspot.com',
  messagingSenderId: '184412093004',
  appId: '1:184412093004:web:114344c90c049b518c12e9'
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// FCM ON BACKGROUND NOTIFICATION
messaging.setBackgroundMessageHandler((payload) => {
    const title = payload.notification.title;
    const options = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        data: {
            clickAction: payload.notification.click_action,
        }
    };

    self.registration.showNotification(title,  options);
    self.registration.hideNotification();
});

// SW ON NOTIFICATION CLICK
self.addEventListener('notificationclick', (evt) => {
    evt.notification.close();
    // see if the current is open and if it is focus it
    // otherwise open new tab
    evt.waitUntil(
        self.clients.matchAll()
            .then(async (clientList) => {
                if (clientList.length > 0) {
                    await clientList[0].focus();

                    return clientList[0].navigate(evt.notification.data.clickAction);
                }
                
                return self.clients.openWindow(evt.notification.data.clickAction);
            })
    );
});

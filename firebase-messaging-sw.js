/* eslint-disable no-undef */

// FCM WEB PUSH NOTIFICATION
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

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

// SW ON INSTALL
self.addEventListener('install', async (event) => {
    event.waitUntil(self.skipWaiting());
});

// SW ON ACTIVATE
self.addEventListener('activate', async (event) => {
    // Controll all app tabs
    event.waitUntil(self.clients.claim());
    console.log('[Firebase SW]: Service worker has been activated');
});

// FCM ON BACKGROUND NOTIFICATION
messaging.setBackgroundMessageHandler((payload) => {
    const title = payload.notification.title;
    const options = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    self.registration.showNotification(title,  options);
    self.registration.hideNotification();
});

// SW ON NOTIFICATION CLICK
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

import firebase from 'firebase';
import {Workbox} from 'workbox-window';

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

// REGISTER FIREBASE SW WITH WORKBOX
if ('serviceWorker' in navigator) {
    const wb = new Workbox('sw.js');

    wb.register()
        .then((registration) => {
            console.log('[Firebase SW] Registration successful with scope: ', registration.scope);
            registration.update();
            firebase.messaging().useServiceWorker(registration);

            // SHOW NOTIFICATION ON MESSAGE
            firebase.messaging().onMessage((payload) => {
                const title = payload.notification.title;
                const options = {
                    body: payload.notification.body,
                    icon: payload.notification.icon,
                    data: {
                        clickAction: payload.notification.click_action,
                    }
                };
                registration.showNotification(title, options);           
            });
        })
        .catch((err) => {
            console.error('[Firebase SW] Registration failed: ', err);
        });
} else {
    console.warn('[Firebase SW] Service worker is not supported');
}

export const updateMessagingToken = async () => {
    try {
        const messaging = firebase.messaging();
        const token = await messaging.getToken();
        const currentUserId = firebase.auth().currentUser.uid;

        await db.ref(`users/${currentUserId}`)
            .update({
                messagingToken: token,
            });

        console.log(`[Firebase messaging] Token sent to server: ${token}`);
    } catch (error) {
        console.error(`[Firebase messaging] ${error}`);
    }
}

export const checkNotificationsPermission = async () => {
    if (Notification.permission === 'default') {
        try {
            const messaging = firebase.messaging();
            await messaging.requestPermission();

            updateMessagingToken();
        } catch (error) {
            console.error(`[Firebase messaging] ${error}`);
        }
    }
}

export const sendNotificationToUser = async ({title, body, link, userId}) => {
    const notificationData = JSON.stringify({
        message: {
            notification: {
                title,
                body,
                click_action: link,
                icon: '/assets/icon-512x512.png',
            },
        },
        userId,
    });

    const response = await fetch('https://tuychin.space/api/notification', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: notificationData,
    });

    console.log(`[Firebase messaging] Notification sent. Status - ${response.status}`, notificationData);

    return response;
}

export const auth = firebase.auth;
export const db = firebase.database();

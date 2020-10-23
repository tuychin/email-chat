import firebase from 'firebase';

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

// REGISTER FIREBASE NOTIFICATION SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
        .then((registration) => {
            console.log('[Firebase SW]: Registration successful with scope: ', registration.scope);
            registration.update();

            firebase.messaging().useServiceWorker(registration);
            // SHOW NOTIFICATION ON MESSAGE
            firebase.messaging().onMessage((payload) => {
                const title = payload.notification.title;
                const options = {
                    body: payload.notification.body,
                    icon: payload.notification.icon,
                };
                registration.showNotification(title, options);           
            });
        })
        .catch((err) => {
            console.error('[Firebase SW]: Registration failed: ', err);
        });
} else {
    console.warn('[Firebase SW]: Service worker is not supported');
}

export const askForPermissionNotifications = async () => {
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('User token:', token);
        
        return token;
    } catch (error) {
        console.error(error);
    }
}

export const checkUserToken = async () => {
    const messaging = firebase.messaging();
    const token = await messaging.getToken();

    if (token) {
        console.log('User token:', token);
    }
}

export const auth = firebase.auth;
export const db = firebase.database();

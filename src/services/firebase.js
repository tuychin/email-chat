import firebase from 'firebase';

firebase.initializeApp({
    apiKey: 'AIzaSyC7Xblmorl6POclj6xzQI_-WrlCLFO7CYE',
    authDomain: 'my-chat-c4f16.firebaseapp.com',
    databaseURL: 'https://my-chat-c4f16.firebaseio.com',
    projectId: 'my-chat-c4f16',
    storageBucket: 'my-chat-c4f16.appspot.com',
    messagingSenderId: '184412093004',
    appId: '1:184412093004:web:114344c90c049b518c12e9'
});

export const registerSW =() => {
    navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
            firebase.messaging().useServiceWorker(registration);
        });
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

export const auth = firebase.auth;
export const db = firebase.database();

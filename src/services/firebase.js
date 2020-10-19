import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyC7Xblmorl6POclj6xzQI_-WrlCLFO7CYE',
    authDomain: 'my-chat-c4f16.firebaseapp.com',
    databaseURL: 'https://my-chat-c4f16.firebaseio.com',
    projectId: 'my-chat-c4f16',
    storageBucket: 'my-chat-c4f16.appspot.com',
    messagingSenderId: '184412093004',
    appId: '1:184412093004:web:114344c90c049b518c12e9'
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();

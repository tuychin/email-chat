import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyC7Xblmorl6POclj6xzQI_-WrlCLFO7CYE',
    authDomain: 'my-chat-c4f16.firebaseapp.com',
    databaseURL: 'https://my-chat-c4f16.firebaseio.com'
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();

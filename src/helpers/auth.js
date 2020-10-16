import { auth, db } from '../services/firebase';

export function sendConfirmEmail(email) {
    var actionCodeSettings = {
        url: 'http://localhost:8080',
        handleCodeInApp: true,
    };

    auth().languageCode = 'ru';

    return auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => window.localStorage.setItem('emailForSignIn', email));
}

export function checkConfirmEmail() {
    if (auth().isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
            email = window.prompt('Введите Email для подтверждения.');
        }

        return auth().signInWithEmailLink(email, window.location.href)
            .then((res) => {
                window.localStorage.removeItem('emailForSignIn');
                return res;
            })
            .then(res => addNewUser(res))
            .catch((err) => {
                console.log(err);
                window.alert('Ссылка недействительна. Это может произойти, если почта введена неправильно, истек срок действия ссылки или она уже использовалась.');
            });
    }
}

export function signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return auth().signInWithPopup(provider)
        .then(res => addNewUser(res))
}

export function signInWithGitHub() {
    const provider = new auth.GithubAuthProvider();
    return auth().signInWithPopup(provider)
        .then(res => addNewUser(res))
}


export function signOut() {
    return auth().signOut();
}


/**utility functions */

async function addNewUser(res) {
    const {user, additionalUserInfo} = res;
    const isNewUser = additionalUserInfo.isNewUser;

    if (isNewUser) {
        await db.ref(`users/${user.uid}`)
            .set({
                uid: user.uid,
                email: user.email,
            });
    }

    return;
}
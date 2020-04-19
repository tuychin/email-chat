import { auth } from '../services/firebase';

export function sendConfirmEmail(email) {
    var actionCodeSettings = {
        url: 'http://localhost:8080',
        handleCodeInApp: true,
    };

    auth().languageCode = 'ru';

    return auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
        });
}

export function checkConfirmEmail() {
    if (auth().isSignInWithEmailLink(window.location.href)) {
        var email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
            email = window.prompt('Введите Email для подтверждения.');
        }

        return auth().signInWithEmailLink(email, window.location.href)
            .then(() => {
                window.localStorage.removeItem('emailForSignIn');
            })
            .catch((err) => {
                console.log(err);
                window.alert('Ссылка недействительна. Это может произойти, если почта введена неправильно, истек срок действия ссылки или она уже использовалась.');
            });
    }
}

export function signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return auth().signInWithPopup(provider);
}

export function signInWithGitHub() {
    const provider = new auth.GithubAuthProvider();
    return auth().signInWithPopup(provider);
}


export function signOut() {
    return auth().signOut();
}

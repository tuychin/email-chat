/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';

export default function withInstallPwaApp(WrappedComponent) {
    let deferredPrompt;

    return (props) => {
        const [appIsInstalled, setAppIsInstalled] = useState(true);

        useEffect(() => {
            window.addEventListener('beforeinstallprompt', (evt) => {
                // Prevent the mini-infobar from appearing on mobile
                evt.preventDefault();
                // Stash the event so it can be triggered later.
                deferredPrompt = evt;
                // Update UI notify the user they can install the PWA
                setAppIsInstalled(false);
            });
        });

        const installApp = () => {
            // Hide the app provided install promotion
            setAppIsInstalled(true);
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('[PWA install]: User accepted the install prompt');
                } else {
                    console.log('[PWA install]: User dismissed the install prompt');
                }
            });
        }
        
        return (
            <WrappedComponent
                appIsInstalled={appIsInstalled}
                installApp={installApp}
                {...props}
            />
        );
    }
}

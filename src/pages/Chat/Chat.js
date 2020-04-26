import React, { Component, useEffect } from 'react';
import getCurrentTime from '../../helpers/getCurrentTime';
import { Link } from 'react-router-dom';
import { signOut } from '../../helpers/auth';
import { auth } from '../../services/firebase';
import { db } from '../../services/firebase';

import MessageHistory from '../../components/MessageHistory';
import Dialogs from '../../components/Dialogs';

import './chat.css';

export default class Chat extends Component {
    state = {
        currentUser: auth().currentUser,
        currentDialog: '',
        dialogs: [],
        messages: [],
        messagesAlert: null,
        messagesError: null,
        dialogsAlert: null,
        dialogsError: null,
    };

    componentDidMount() {
        this.getDialogs();
        db.ref('users')
            .startAt('example@gmail.com') 
            .endAt('example@gmail.com') 
            .once('value', function(snap) {
                console.log('accounts matching email address', snap.val())
            })
    }

    createDialog = async (email) => {
        const {currentUser} =this.state;

        this.setState({dialogsError: null});

        try {
            await db.ref('dialogs')
                .push(true)
                .then((res) => {
                    this.setState({currentDialog: res.key});
                    this.getMessages(res.key);
                });

            /**add dialog to another user by email */
            await db.ref('users')
                .orderByChild('email')
                .equalTo(email)
                .on('child_added',  snapshot => {
                    const anotherUserId = snapshot.key;

                    db.ref(`users/${anotherUserId}/dialogs`)
                        .child(this.state.currentDialog)
                        .set({
                            dialogId: this.state.currentDialog,
                            member: currentUser.email,
                        });
                });

            /**add dialog to current user */
            await db.ref(`users/${currentUser.uid}/dialogs`)
                .child(this.state.currentDialog)
                .set({
                    dialogId: this.state.currentDialog,
                    member: email,
                });

        } catch (error) {
            console.error(error);
            this.setState({dialogsError: error.message});
        }
    }

    getDialogs = () => {
        const {currentUser} =this.state;

        this.setState({dialogsError: null});

        try {
            db.ref(`users/${currentUser.uid}/dialogs`).on('value', snapshot => {
                let dialogs = [];

                snapshot.forEach((snap) => {
                    dialogs.push(snap.val());
                });
                
                this.setState({dialogs});
            });
        } catch (error) {
            console.error(error);
            this.setState({dialogsError: error.message});
        }
    }

    selectDialog = (dialogId) => {
        this.setState({currentDialog: dialogId});
        this.getMessages(dialogId);
    }

    sendMessage = async (content) => {
        const {currentUser, currentDialog} =this.state;

        this.setState({messagesError: null});

        try {
            await db.ref(`dialogs/${currentDialog}`)
            .push(true)
            .then((res) => {
                res.set({
                    message_id: res.key,
                    content: content,
                    date_time: getCurrentTime(),
                    time_stamp: Date.now(),
                    user_id: currentUser.uid,
                    user_email: currentUser.email
                });
            })
        } catch (error) {
            console.error(error);
            this.setState({messagesError: error.message});
        }
    }

    getMessages = (dialogId) => {
        const {currentDialog} =this.state;

        if (currentDialog || dialogId) {
            this.setState({messagesError: null});

            try {
                db.ref(`dialogs/${currentDialog || dialogId}`)
                    .on('value', snapshot => {
                        let messages = [];
        
                        snapshot.forEach((snap) => {
                            messages.push(snap.val());
                        });
        
                        this.setState({messages});
                    });
            } catch (error) {
                console.error(error);
                this.setState({messagesError: error.message});
            }
        }
    }

    render() {
        const {
            currentUser,
            currentDialog,
            dialogs,
            dialogsAlert,
            dialogsError,
            messages,
            messagesAlert,
            messagesError,
        } = this.state;

        return (
            <div>
                <div className="container">
                    <div className="row">
                        <Dialogs
                            currentDialog={currentDialog}
                            dialogs={dialogs}
                            createDialog={this.createDialog}
                            selectDialog={this.selectDialog}
                            alert={dialogsAlert}
                            error={dialogsError}
                        />
                        <MessageHistory
                            user={currentUser}
                            dialog={currentDialog}
                            messages={messages}
                            submit={this.sendMessage}
                            signOut={signOut}
                            alert={messagesAlert}
                            error={messagesError}
                        />
                        <div>
                            Вход выполнен через: <strong>{currentUser.email}</strong>
                            <Link to="/" onClick={signOut}> Выйти </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

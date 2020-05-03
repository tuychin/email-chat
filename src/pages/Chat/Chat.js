import React, { Component, useEffect } from 'react';
import getCurrentTime from '../../helpers/getCurrentTime';
import { Link } from 'react-router-dom';
import { signOut } from '../../helpers/auth';
import { auth } from '../../services/firebase';
import { db } from '../../services/firebase';

import MessageHistory from '../../components/MessageHistory';
import Dialogs from '../../components/Dialogs';

import './chat.css';

const Bevis = require('bevis');

const block = new Bevis('chat');

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
    }

    createDialog = async (email) => {
        this.setState({dialogsError: null});

        if (this.checkDialogExist(email)) return;

        db.ref('users')
            .orderByChild('email')
            .equalTo(email)
            .once('value',  snapshot => {

                /**check user exist */
                if (snapshot.exists()) {
                    console.warn('User exist');
                    this.setState({dialogsAlert: null})
                    try {
                        this.setState({dialogsError: null});

                        /**add dialog to /dialogs */
                        db.ref('dialogs')
                            .push(true)
                            .then((res) => {
                                this.setState({currentDialog: res.key});
                                this.getMessages(res.key);
                            })
                            .then(() => {
                                this.addDialogToAnotherUser(email);
                            })
                            .then(() => {
                                this.addDialogToCurrentUser(email);
                            })
                            .catch((error) => {
                                console.error(error);
                                this.setState({dialogsError: error.message});
                            });
            
                    } catch (error) {
                        console.error(error);
                        this.setState({dialogsError: error.message});
                    }
                } else {
                    this.setState({dialogsAlert: 'Данный пользователь не зарегистрирован'});
                    console.warn('User not exist');
                }

            });
    }

    checkDialogExist = (email) => {
        const {dialogs} = this.state;
        let isDialogAlredyExist = false;

        dialogs.forEach(dialog => {
            if (dialog.member === email) {
                isDialogAlredyExist = true;
                this.selectDialog(dialog.dialogId);
                this.setState({dialogsAlert: 'Такой диалог уже существует'})
            }
        });

        return isDialogAlredyExist;
    }

    addDialogToCurrentUser = async (anotherUserEmail) => {
        const {currentDialog, currentUser} = this.state;

        try {
            await db.ref(`users/${currentUser.uid}/dialogs`)
                .child(currentDialog)
                .set({
                    dialogId: currentDialog,
                    member: anotherUserEmail,
                });
        } catch (error) {
            console.error(error);
            this.setState({dialogsError: error.message});
        }
    }

    addDialogToAnotherUser = async (email) => {
        const {currentDialog, currentUser} = this.state;

        try {
            /**get user id by email */
            await db.ref('users')
                .orderByChild('email')
                .equalTo(email)
                .on('child_added',  snapshot => {
                    const userId = snapshot.key;
                    
                    if (!userId) throw new Error('Id is undefined');
        
                    db.ref(`users/${userId}/dialogs`)
                        .child(currentDialog)
                        .set({
                            dialogId: currentDialog,
                            member: currentUser.email,
                        });
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

        if (dialogId || currentDialog) {
            this.setState({messagesError: null});

            try {
                db.ref(`dialogs/${dialogId || currentDialog}`)
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
            <div className={block.name()}>
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

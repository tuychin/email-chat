import React, { Component, useEffect } from 'react';
import getCurrentTime from '../../helpers/getCurrentTime';
import { Link } from 'react-router-dom';
import { signOut } from '../../helpers/auth';
import { auth } from '../../services/firebase';
import { db } from '../../services/firebase';

import MessageHistory from '../../components/MessageHistory';
import Dialogs from '../../components/Dialogs';

import './chat.scss';

const Bevis = require('bevis');

const block = new Bevis('chat');

export default class Chat extends Component {
    state = {
        currentUser: auth().currentUser,
        currentDialog: '',
        dialogs: [],
        messages: [],
        error: null,
    };

    componentDidMount() {
        this.getDialogs();
    }

    componentDidUpdate() {
        const {error} = this.state;

        if (error) {
            this.showErrorMessage(error);
        }
    }

    showErrorMessage = (errorMessage) => {
        alert(errorMessage)
        this.setState({error: null});
    }

    createDialog = async (email) => {
        this.setState({error: null});

        if (this.checkDialogExist(email)) return;

        db.ref('users')
            .orderByChild('email')
            .equalTo(email)
            .once('value',  snapshot => {

                /**check user exist */
                if (snapshot.exists()) {
                    console.warn('User exist');
                    this.setState({error: null})
                    try {
                        this.setState({error: null});

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
                                this.setState({error: error.message});
                            });
            
                    } catch (error) {
                        console.error(error);
                        this.setState({error: error.message});
                    }
                } else {
                    this.setState({error: 'Данный пользователь не зарегистрирован'});
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
                this.setState({error: 'Такой диалог уже существует'})
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
            this.setState({error: error.message});
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
            this.setState({error: error.message});
        }
    }

    getDialogs = () => {
        const {currentUser} =this.state;

        this.setState({error: null});

        try {
            db.ref(`users/${currentUser.uid}/dialogs`)
                .on('value', snapshot => {
                    const dialogs = [];

                    snapshot.forEach((snap) => {
                        dialogs.push(snap.val());
                    });

                    this.setState({dialogs});
                });
        } catch (error) {
            console.error(error);
            this.setState({error: error.message});
        }
    }

    selectDialog = (dialogId) => {
        this.setState({currentDialog: dialogId});
        this.getMessages(dialogId);
    }

    sendMessage = async (content) => {
        const {currentUser, currentDialog} =this.state;

        this.setState({error: null});

        try {
            await db.ref(`dialogs/${currentDialog}`)
                .push(true)
                .then((res) => {
                    res.set({
                        message_id: res.key,
                        content: content,
                        date_time: getCurrentTime(),
                        time_stamp: new Date().getTime(),
                        user_id: currentUser.uid,
                        user_email: currentUser.email
                    });
                })
        } catch (error) {
            console.error(error);
            this.setState({error: error.message});
        }
    }

    getMessages = (dialogId) => {
        const {currentDialog} =this.state;

        if (dialogId || currentDialog) {
            this.setState({error: null});

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
                this.setState({error: error.message});
            }
        }
    }

    render() {
        const {
            currentUser,
            currentDialog,
            dialogs,
            messages,
        } = this.state;

        return (
            <div className={block.name()}>
                <div className={`${block.elem('container')} container`}>
                    <div className={`${block.elem('row')} row`}>
                        <div className={`${block.elem('col')} col-md-4`}>
                            <Dialogs
                                currentDialog={currentDialog}
                                dialogs={dialogs}
                                createDialog={this.createDialog}
                                selectDialog={this.selectDialog}
                            />
                        </div>
                        <div className={`${block.elem('col')} col-md-8`}>
                            <MessageHistory
                                user={currentUser}
                                dialog={currentDialog}
                                messages={messages}
                                submit={this.sendMessage}
                                signOut={signOut}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/***
<div>
    Вход выполнен через: <strong>{currentUser.email}</strong>
    <Link to="/" onClick={signOut}> Выйти </Link>
</div>
***/
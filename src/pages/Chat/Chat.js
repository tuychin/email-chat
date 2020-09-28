import React, { memo, useEffect } from 'react';
import getCurrentTime from '../../helpers/getCurrentTime';
import { signOut } from '../../helpers/auth';
import { db, auth } from '../../services/firebase';
import { useSelector, useDispatch } from 'react-redux';
import {
    setCurrentUser,
    setCurrentMember,
    setCurrentDialog,
    setDialogs,
    setMessages,
    setError,
    clearError,
    showErrorMessage,

    selectCurrentUser,
    selectCurrentMember,
    selectCurrentDialog,
    selectDialogs,
    selectMessages,
    selectError,
} from './chatSlice';

import MessageHistory from '../../components/MessageHistory';
import Dialogs from '../../components/Dialogs';

import './chat.scss';

const Bevis = require('bevis');

const block = new Bevis('chat');

export default memo(function Chat() {
    const dispatch = useDispatch();

    const currentUser = useSelector(selectCurrentUser);
    const currentMember = useSelector(selectCurrentMember);
    const currentDialog = useSelector(selectCurrentDialog);
    const dialogs = useSelector(selectDialogs);
    const messages = useSelector(selectMessages);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(setCurrentUser(auth().currentUser));
        fetchDialogs(auth().currentUser);

        if (error) dispatch(showErrorMessage(error));
    }, [error]);

    async function createDialog(email) {
        dispatch(clearError());

        if (checkDialogExist(email)) return;

        db.ref('users')
            .orderByChild('email')
            .equalTo(email)
            .once('value',  snapshot => {

                /**check user exist */
                if (snapshot.exists()) {
                    console.warn('User exist');
                    dispatch(clearError());
                    try {
                        dispatch(clearError());

                        /**add dialog to /dialogs */
                        db.ref('dialogs')
                            .push(true)
                            .then((res) => {
                                dispatch(setCurrentDialog(res.key));
                                fetchMessages(res.key);
                            })
                            .then(() => {
                                addDialogToAnotherUser(email);
                            })
                            .then(() => {
                                addDialogToCurrentUser(email);
                            })
                            .catch((error) => {
                                console.error(error);
                                dispatch(setError(error.message));
                            });
            
                    } catch (error) {
                        console.error(error);
                        dispatch(setError(error.message));
                    }
                } else {
                    dispatch(setError('Данный пользователь не зарегистрирован'));
                    console.warn('User not exist');
                }

            });
    }

    function checkDialogExist(email) {
        let isDialogAlredyExist = false;

        dialogs.forEach(dialog => {
            if (dialog.member === email) {
                isDialogAlredyExist = true;
                selectDialog(dialog.dialogId);
                dispatch(setError('Такой диалог уже существует'));
            }
        });

        return isDialogAlredyExist;
    }

    async function addDialogToCurrentUser(anotherUserEmail) {
        try {
            await db.ref(`users/${currentUser.uid}/dialogs`)
                .child(currentDialog)
                .set({
                    dialogId: currentDialog,
                    member: anotherUserEmail,
                });
        } catch (error) {
            console.error(error);
            dispatch(setError(error.message));
        }
    }

    async function addDialogToAnotherUser(email) {
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
            dispatch(setError(error.message));
        }
    }

    function fetchDialogs(currentUser) {
        dispatch(clearError());

        try {
            db.ref(`users/${currentUser.uid}/dialogs`)
                .on('value', snapshot => {
                    const dialogs = [];

                    snapshot.forEach((snap) => {
                        dialogs.push(snap.val());
                    });

                    dispatch(setDialogs(dialogs));
                });
        } catch (error) {
            console.error(error);
            dispatch(setError(error.message));
        }
    }

    function selectDialog(dialogId, memberName) {
        dispatch(setCurrentDialog(dialogId));
        dispatch(setCurrentMember(memberName));
        fetchMessages(dialogId);
    }

    async function sendMessage(content) {
        dispatch(clearError());

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
            dispatch(setError(error.message));
        }
    }

    function fetchMessages(dialogId) {
        if (dialogId || currentDialog) {
            dispatch(clearError());

            try {
                db.ref(`dialogs/${dialogId || currentDialog}`)
                    .on('value', snapshot => {
                        let messages = [];
        
                        snapshot.forEach((snap) => {
                            messages.push(snap.val());
                        });
        
                        dispatch(setMessages(messages));
                    });
            } catch (error) {
                console.error(error);
                dispatch(setError(error.message));
            }
        }
    }

    return (
        <div className={block.name()}>
            <div className={`${block.elem('container')} container`}>
                <div className={`${block.elem('row')} row`}>
                    <div className={`${block.elem('col')} col-md-4`}>
                        <Dialogs
                            currentDialog={currentDialog}
                            dialogs={dialogs}
                            createDialog={createDialog}
                            selectDialog={selectDialog}
                        />
                    </div>
                    <div className={`${block.elem('col')} col-md-8`}>
                        <MessageHistory
                            user={currentUser}
                            member={currentMember}
                            dialog={currentDialog}
                            messages={messages}
                            submit={sendMessage}
                            signOut={signOut}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

/***
<div>
    Вход выполнен через: <strong>{currentUser.email}</strong>
    <Link to="/" onClick={signOut}> Выйти </Link>
</div>
***/
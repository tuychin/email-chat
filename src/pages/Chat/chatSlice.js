
import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../services/firebase';
import getCurrentTime from '../../helpers/getCurrentTime';

// Reducers
export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        currentUser: {},
        currentMember: '',
        currentDialog: '',
        dialogs: [],
        messages: [],
        error: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser.uid = action.payload.uid;
            state.currentUser.email = action.payload.email;
            state.currentUser.displayName = action.payload.displayName;
        },
        setCurrentMember: (state, action) => {
            state.currentMember = action.payload;
        },
        setCurrentDialog: (state, action) => {
            state.currentDialog = action.payload;
        },
        setDialogs: (state, action) => {
            state.dialogs = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: state => {
            state.error = null;
        },
        showErrorMessage: state => {
            alert(state.error);
            state.error = null;
        },
    },
});

// Actions
export const {
    setCurrentUser,
    setCurrentMember,
    setCurrentDialog,
    setDialogs,
    setMessages,
    setError,
    clearError,
    showErrorMessage,
} = chatSlice.actions;

// Thunks
const checkDialogExist = (email) => (dispatch, getState) => {
    const {dialogs} = getState().chat;

    let isDialogAlredyExist = false;

    dialogs.forEach(dialog => {
        if (dialog.member === email) {
            isDialogAlredyExist = true;
            dispatch(chooseDialog(dialog.dialogId, dialog.member));
            dispatch(setError('Такой диалог уже существует'));
        }
    });

    return isDialogAlredyExist;
}

const addDialogToCurrentUser = (anotherUserEmail) => async (dispatch, getState) => {
    const {currentUser, currentDialog} = getState().chat;

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

const addDialogToAnotherUser = (email) => async (dispatch, getState) => {
    const {currentUser, currentDialog} = getState().chat;

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

export function createDialog(email) {
    return (dispatch) => {
        dispatch(clearError());

        if (dispatch(checkDialogExist(email))) return;

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
                                dispatch(fetchMessages(res.key));
                            })
                            .then(() => {
                                dispatch(addDialogToAnotherUser(email));
                            })
                            .then(() => {
                                dispatch(addDialogToCurrentUser(email));
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
}

export function fetchDialogs(currentUser) {
    return (dispatch) => {
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
}

export function chooseDialog(dialogId, memberName) {
    return (dispatch) => {
        dispatch(setCurrentDialog(dialogId));
        dispatch(setCurrentMember(memberName));
        dispatch(fetchMessages(dialogId));
    }
}

export function sendMessage(content) {
    return async (dispatch, getState) => {
        const {currentUser, currentDialog} = getState().chat;

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
}

export function fetchMessages(dialogId) {
    return (dispatch, getState) => {
        const {currentDialog} = getState().chat;

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
}


// Selectors
export const selectCurrentUser = state => state.chat.currentUser;
export const selectCurrentMember = state => state.chat.currentMember;
export const selectCurrentDialog = state => state.chat.currentDialog;
export const selectDialogs = state => state.chat.dialogs;
export const selectMessages = state => state.chat.messages;
export const selectError = state => state.chat.error;

export default chatSlice.reducer;

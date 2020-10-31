
import {createSlice} from '@reduxjs/toolkit';
import {db} from '../../services/firebase';
import getCurrentTime from '../../utils/getCurrentTime';

// Reducers
export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        currentUser: {},
        currentMemberEmail: '',
        currentDialogId: '',
        dialogs: null,
        messages: null,
        isMessagesOpen: false,
        error: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser.uid = action.payload.uid;
            state.currentUser.email = action.payload.email;
            state.currentUser.displayName = action.payload.displayName;
            state.currentUser.messagingToken = action.payload.messagingToken;
        },
        setCurrentMemberEmail: (state, action) => {
            state.currentMemberEmail = action.payload;
        },
        setCurrentDialog: (state, action) => {
            state.currentDialogId = action.payload;
        },
        setDialogs: (state, action) => {
            state.dialogs = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        openMessages: state => {
            state.isMessagesOpen = true;
        },
        closeMessages: state => {
            state.isMessagesOpen = false;
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
    setCurrentMemberEmail,
    setCurrentDialog,
    setDialogs,
    setMessages,
    openMessages,
    closeMessages,
    setError,
    clearError,
    showErrorMessage,
} = chatSlice.actions;

// Thunks
const checkDialogExist = (email) => (dispatch, getState) => {
    const {dialogs} = getState().chat;

    let isDialogAlredyExist = false;

    dialogs.forEach(dialog => {
        if (dialog.member.email === email) {
            isDialogAlredyExist = true;
            dispatch(openDialog(dialog.dialogId, dialog.member.email));
            dispatch(setError('Такой диалог уже существует'));
        }
    });

    return isDialogAlredyExist;
}

const addDialogToCurrentUser = (anotherUserEmail) => async (dispatch, getState) => {
    const {currentUser, currentDialogId} = getState().chat;

    try {
        // Get user id by email
        await db.ref('users')
            .orderByChild('email')
            .equalTo(anotherUserEmail)
            .on('child_added',  snapshot => {
                const anotherUserId = snapshot.key;

                // Set member data
                db.ref(`users/${currentUser.uid}/dialogs`)
                    .child(currentDialogId)
                    .set({
                        dialogId: currentDialogId,
                        member: {
                            id: anotherUserId,
                            email: anotherUserEmail,
                        },
                    });
            });
    } catch (error) {
        console.error(error);
        dispatch(setError(error.message));
    }
}

const addDialogToAnotherUser = (email) => async (dispatch, getState) => {
    const {currentUser, currentDialogId} = getState().chat;

    try {
        // Get user id by email
        await db.ref('users')
            .orderByChild('email')
            .equalTo(email)
            .on('child_added',  snapshot => {
                const anotherUserId = snapshot.key;

                // Set member data
                db.ref(`users/${anotherUserId}/dialogs`)
                    .child(currentDialogId)
                    .set({
                        dialogId: currentDialogId,
                        member: {
                            id: currentUser.uid,
                            email: currentUser.email,
                        },
                    });
            });
    } catch (error) {
        console.error(error);
        dispatch(setError(error.message));
    }
}

export function updateUserData(key, value) {
    return async (dispatch, getState) => {
        const {currentUser} = getState().chat;

        try {
            await db.ref(`users/${currentUser.uid}`)
                .update({
                    [key]: value,
                });
        } catch (error) {
            console.error(error);
            dispatch(setError(error.message));
        }
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
                                dispatch(openDialog(res.key, email));
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

export function openDialog(dialogId, memberName) {
    return (dispatch) => {
        dispatch(openMessages());
        dispatch(setCurrentDialog(dialogId));
        dispatch(setCurrentMemberEmail(memberName));
        dispatch(fetchMessages(dialogId));
    }
}

export function sendMessage(content) {
    return async (dispatch, getState) => {
        const {currentUser, currentDialogId} = getState().chat;

        dispatch(clearError());

        try {
            await db.ref(`dialogs/${currentDialogId}`)
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
        const {currentDialogId} = getState().chat;

        if (dialogId || currentDialogId) {
            dispatch(clearError());

            try {
                db.ref(`dialogs/${dialogId || currentDialogId}`)
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
export const selectCurrentMemberEmail = state => state.chat.currentMemberEmail;
export const selectCurrentDialog = state => state.chat.currentDialogId;
export const selectDialogs = state => state.chat.dialogs;
export const selectMessages = state => state.chat.messages;
export const selectIsMessagesOpen = state => state.chat.isMessagesOpen;
export const selectError = state => state.chat.error;

export default chatSlice.reducer;


import { createSlice, current } from '@reduxjs/toolkit';

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
            state.value = null;
        },
        showErrorMessage: state => {
            alert(state.error);
            state.value = null;
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
export const fetchCurrentUser = currentUser => dispatch => {
    dispatch(setCurrentUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
    }));
};

// Selectors
export const selectCurrentUser = state => state.chat.currentUser;
export const selectCurrentMember = state => state.chat.currentMember;
export const selectCurrentDialog = state => state.chat.currentDialog;
export const selectDialogs = state => state.chat.dialogs;
export const selectMessages = state => state.chat.messages;
export const selectError = state => state.chat.error;

export default chatSlice.reducer;
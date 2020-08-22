import {configureStore} from '@reduxjs/toolkit';
import chatSlice from '../src/pages/Chat/chatSlice';

const reducer = {
    chat: chatSlice,
}

const store = configureStore({
    reducer,
});

export default store;
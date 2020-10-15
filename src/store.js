import {configureStore} from '@reduxjs/toolkit';
import chatSlice from '../src/pages/Chat/chatSlice';
import menuSlice from '../src/components/Menu/menuSlice';

const reducer = {
    chat: chatSlice,
    menu: menuSlice,
}

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

export default store;
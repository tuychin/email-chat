
import {createSlice} from '@reduxjs/toolkit';

// Reducers
export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menuIsOpen: false,
        theme: 'default',
    },
    reducers: {
        openMenu: (state) => {
            state.menuIsOpen = true;
        },
        closeMenu: (state) => {
            state.menuIsOpen = false;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

// Actions
export const {
    openMenu,
    closeMenu,
    setTheme,
} = menuSlice.actions;

// Thunks


// Selectors
export const selectMenuIsOpen = state => state.menu.menuIsOpen;
export const selectTheme = state => state.menu.theme;

export default menuSlice.reducer;

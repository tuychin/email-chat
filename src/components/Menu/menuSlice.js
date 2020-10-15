
import {createSlice} from '@reduxjs/toolkit';

// Reducers
export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menuIsOpen: false,
    },
    reducers: {
        openMenu: (state) => {
            state.menuIsOpen = true;
        },
        closeMenu: (state) => {
            state.menuIsOpen = false;
        },
    },
});

// Actions
export const {
    openMenu,
    closeMenu,
} = menuSlice.actions;

// Thunks


// Selectors
export const selectMenuIsOpen = state => state.menu.menuIsOpen;

export default menuSlice.reducer;

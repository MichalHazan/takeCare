//locationSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    city: ' ',
    street: ' ',
    houseNumber: 0,
    coordinates: null,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setCity(state, action) {
            state.city = action.payload;
        },
        setStreet(state, action) {
            state.street = action.payload;
        },
        setHouseNumber(state, action) {
            state.houseNumber = action.payload;
        },
        setCoordinates(state, action) {
            state.coordinates = action.payload;
        },
        resetLocation(state) {
            state.city = '';
            state.street = '';
            state.houseNumber = '';
            state.coordinates = null;
        },
    },
});

export const {
    setCity,
    setStreet,
    setHouseNumber,
    setCoordinates,
    resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;

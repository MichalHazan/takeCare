// store.js
import { configureStore } from '@reduxjs/toolkit';
import dateReducer from "./CreateAccount/DateBirth/dateSlice";
import personalDetailsReducer from './CreateAccount/PersonalDetails/personalDetailsSlice';
import locationReducer from "./CreateAccount/LocationFields/locationSlice";
// import professionalDetailsReducer from "./CreateAccount/ProfessionalDetails/professionalDetailsSlice";
import professionalDetailsReducer from "./CreateAccount/ProfessionalDetails/professionalDetailsSlice";


const store = configureStore({
    reducer: {
        date: dateReducer, // ניהול תאריך
        personalDetails: personalDetailsReducer,
        location: locationReducer,
        professionalDetails: professionalDetailsReducer,

    },
});

export default store;
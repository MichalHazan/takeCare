import { createSlice } from "@reduxjs/toolkit";

// פונקציה לעיצוב תאריך בפורמט ISO 8601
export const formatDate = (day, month, year) => {
    if (!day || !month || !year) return null;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00.000Z`;
};

// פונקציה לבדיקה אם תאריך תקין
export const validateDate = (day, month, year) => {
    if (!day || !month || !year) return false;
    return (
        day > 0 &&
        day <= 31 &&
        month > 0 &&
        month <= 12 &&
        year > 0 &&
        year <= new Date().getFullYear()
    );
};
// Redux Slice
const dateSlice = createSlice({
    name: "date",
    initialState: {
        day: null,
        month: null,
        year: null,
        formattedDate: null,
        dateError: false,
        DateErrorMessage: "",

    },
    reducers: {
        updateDate: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        setDateError: (state, action) => {
            state.dateError = action.payload.dateError;
            state.formattedDate = action.payload.formattedDate;
            state.DateErrorMessage = action.payload.DateErrorMessage; // הוספת שדה הודעה
        },
    },
});

export const { updateDate, setDateError } = dateSlice.actions;
export default dateSlice.reducer;

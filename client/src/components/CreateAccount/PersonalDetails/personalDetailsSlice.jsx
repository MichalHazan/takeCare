import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  role:"customer",
  firstNameError: false,
  lastNameError: false,
  emailError: false,
  emailErrorMessage: "",
  phoneError: false,
  phoneErrorMessage: "",
  isFormValid: false,
};

const validateName = (name) => {
  if (typeof name !== "string") {
    return false;
  }
  if(name===""){
    return true
  }
  const regex = /^[\u0590-\u05FFa-zA-Z\s]+$/;
  return regex.test(name.trim());
};

const validatePhoneNumber = (phoneNumber) => {
  if(phoneNumber===""){
    return true
  }
  const phoneRegex = /^\d+$/;
  return phoneRegex.test(phoneNumber);
};

const validateEmail = (email) => {
  if(email===""){
    return true
  }
  const emailRegex = /^[a-zA-Z0-9.@]+$/;
  return emailRegex.test(email);

};

const validateForm = (state) => {
  const isNameValid =
      validateName(state.firstName) && validateName(state.lastName);
  const isUsernameValid = state.username.trim().length > 0;
  const isEmailValid = validateEmail(state.email);
  const isPasswordValid = state.password.trim().length > 0;
  const isPhoneValid = validatePhoneNumber(state.phone);
  const isGenderValid = state.gender.trim().length > 0;
  const isRolrValid = state.role.trim().length > 0;


  return (
      isNameValid &&
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPhoneValid &&
      isGenderValid&&
      isRolrValid
  );
};

const personalDetailsSlice = createSlice({
  name: "personalDetails",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      //Validate specific fields
      if (field === "email") {
        //   if(value===""){
        state.emailError = !validateEmail(value);//}
      }
      if (field === "phone") {
        state.phoneError = !validatePhoneNumber(value);
      }
      if (field === "firstName") {
        state.firstNameError = !validateName(value);
      }
      if (field === "lastName") {
        state.lastNameError = !validateName(value);
      }
      // Revalidate the entire form
      state.isFormValid = validateForm(state);
    },
  },
});

export const { updateField } = personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;

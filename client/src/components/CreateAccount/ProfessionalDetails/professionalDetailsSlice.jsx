// //professionalDetailsSlice.jsx
// import { createSlice } from "@reduxjs/toolkit";
//
// const initialState = {
//   professions: [],
//   services: {
//     inPerson: true,
//     viaZoom: false,
//   },
//   description: "",
//   hourlyRate: "",
// };
//
// const professionalDetailsSlice = createSlice({
//   name: "professionalDetails",
//   initialState,
//   reducers: {
//     setProfessions(state, action) {
//       state.professions = action.payload;
//     },
//     setService(state, action) {
//       const { serviceType, isChecked } = action.payload;
//       state.services[serviceType] = isChecked;
//     },
//     setDescription(state, action) {
//       state.description = action.payload;
//     },
//     setHourlyRate(state, action) {
//       state.hourlyRate = action.payload;
//     },
//   },
// });
//
// export const {
//   setProfessions,
//   setService,
//   setDescription,
//   setHourlyRate,
// } = professionalDetailsSlice.actions;
//
// export default professionalDetailsSlice.reducer;

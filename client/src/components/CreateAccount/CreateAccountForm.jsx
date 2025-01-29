//CreateAccountForm.jsx
import React, { useState } from "react";
import { Checkbox, FormControlLabel, Box, Button, Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "./CreateAccountForm.css";
import DateBirth from "./DateBirth/DateBirth";
import PersonalDetailsFields from "./PersonalDetails/PersonalDetailsFields";
import LocationFields from "./LocationFields/LocationFields";
import { updateField } from "./PersonalDetails/personalDetailsSlice";
import axios from "axios";
import axiosInstance from '../../api/axiosConfig';
import { ProfessionalFields } from "./ProfessionalDetails/ProfessionalFields";
import { setDateError,validateDate, formatDate } from "./DateBirth/dateSlice";


const CreateAccountForm = () => {
    // const [role, setRole] = useState("customer");
    const [isProfessional, setIsProfessional] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    let hasError = false;
    const { day, month, year,formattedDate,dateError,DateErrorMessage } = useSelector((state) => state.date);
    const {
        firstName,
        lastName,
        username,
        email,
        role,
        password,
        phone,
        gender,
    } =
        useSelector((state) => state.personalDetails);
    const { professions, services, description, images ,hourlyRate } = useSelector((state) => state.professionalDetails);

    const { city, street, houseNumber, coordinates } = useSelector((state) => state.location);

    const validateDateBirth = (day, month, year) => {
        if (!day || !month || !year) {
            return false;
        }
            return (!validateDate(day, month, year))
    };

    const validateEmail = (email) => {
        //return  true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        //return  true
        const phoneRegex = /^\d{10,15}$/; // רק מספרות, בין 10 ל-15 ספרות
        return phoneRegex.test(phoneNumber);
    };

    const handleSubmit1 = () => {
         hasError = false;
        if (!validateEmail(email)) {
            let message = "";
            if (email === "") {
                message = t("Please enter email address");
            } else {
                message = t("Please enter a valid email address");
            }

            dispatch(updateField({ field: "emailError", value: true }));
            dispatch(updateField({ field: "emailErrorMessage", value: message })); // שמירת ההודעה ב-Redux
            hasError = true;
        }

        // Validate phone
        if (!validatePhoneNumber(phone)) {
            let messagePhone = "";
            if (phone === "") {
                messagePhone = t("Please enter phone number");
            } else {
                messagePhone = t("Please enter a valid phone number");
            }

            dispatch(updateField({ field: "phoneError", value: true }));
            dispatch(updateField({ field: "phoneErrorMessage", value: messagePhone })); // שמירת ההודעה ב-Redux
            hasError = true;
        }
        // Validate date of birth
        if (!validateDateBirth(day, month, year)) {
            let messageDate=""
            if (!day || !month || !year) {
                messageDate = `${t("Please fill out your birth date")}`;
            } else {
                messageDate = `${t("Please enter a valid Data")}`;
            }
            dispatch(setDateError({ dateError: true, formattedDate: null, DateErrorMessage: messageDate }));

            dispatch(updateField({ field: "dateError", value: true })); // עדכון Redux אם צריך
            dispatch(updateField({ field: "DateErrorMessage", value: messageDate })); // שמירת ההודעה ב-Redux
            hasError = true;
        }

        if (hasError) {
            //return;
        }

        console.log("Submitted Data:");
        console.log(`Date of Birth - Day: ${day}, Month: ${month}, Year: ${year}`);
        console.log(`formattedDate: ${formattedDate}`)
        console.log(`First Name: ${firstName}`);
        console.log(`Last Name: ${lastName}`);
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Phone: ${phone}`);
        console.log(`Gender: ${gender}`);
        console.log(`City: ${city}`);
        console.log(`Street: ${street}`);
        console.log(`Rolr: ${role}`);
        console.log(`House Number: ${houseNumber}`);
        console.log(`Coordinates: ${JSON.stringify(coordinates)}`);
        console.log(`Professions: ${professions?.join(", ") || "None"}`);
        console.log(`DateErrorMessage: ${DateErrorMessage}`);
        console.log(`Services: ${JSON.stringify(services)}`);
        console.log(`Description: ${description || "No description"}`);
        console.log(`Images: ${images?.length ? images.join(", ") : "No images"}`);
        console.log(`Hourly Rate: ${hourlyRate ? parseFloat(hourlyRate) : "Not set"}`);
    };


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    ////////////////////////////////////////////////////////////////
    const handleSubmit2 = async (e) => {

        e.preventDefault();
        setIsLoading(true);
        setError("");
        //setError("");
        //setLocationError(null);
        let fullname = `${firstName} ${lastName}`;
        // let cityName = selectedCity;
        // let streetName = selectedStreet;


        try {
            // Get location coordinates
            let location = { "type": "Point", "coordinates": [35.2137, 31.7683] };
            const dateBirthc=new Date(year, month - 1, day)
            console.log("Submitted Data:");
            console.log(`Date of Birth - Day: ${dateBirthc}`);



            const payload = {
                fullname,
                username,
                email,
                password,
                phone,
                gender,
                birthDate: new Date(dateBirthc),
                location,
                cityName: city,
                streetName: street,
                role: role,
                ...(isProfessional && {
                    professions,
                    services,
                    description,
                    images,
                    hourlyRate: parseFloat(hourlyRate)
               })
            };
            console.log('payload',payload)
            const response = await axiosInstance.post("/api/users/register", payload);

            console.log("Registration successful:", response.data);
            // Handle successful registration (e.g., redirect, show success message)
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        handleSubmit1();

        console.log("State from Redux:" );

        handleSubmit2(e);
    };


    return (
        <Box className="form-container">
            <PersonalDetailsFields openSnackbar={openSnackbar} handleCloseSnackbar={() => setOpenSnackbar(false)} />
            <DateBirth />
            <LocationFields />
            <FormControlLabel
                control={
                    <Checkbox
                        sx={{ color: "#fab28d", "&.Mui-checked": { color: "#fab28d" } }}
                        // checked={isProfessional}
                        onChange={(e) => {
                            dispatch(updateField({ field: "role", value: e.target.checked ? "professional" : "customer" }));
                            setIsProfessional(e.target.checked);
                            //setRole(e.target.checked ? "professional" : "customer");
                        }}
                    />
                }
                label={t("I would also like to join as a therapist")}
                className="form-checkbox"
            />

            {/* Professional Details (Conditionally Rendered) */}
            {(isProfessional&&<ProfessionalFields />)}

            <Button
                onClick={handleSubmit}
                className="createTheAccount"
                fullWidth
                variant="contained"
            >
                {t("Create an account")}
            </Button>

            {/*<Snackbar*/}
            {/*    open={openSnackbar}*/}
            {/*    autoHideDuration={6000}*/}
            {/*    onClose={handleCloseSnackbar}*/}
            {/*    anchorOrigin={{ vertical: "top", horizontal: "center" }}*/}
            {/*>*/}
            {/*    /!*<Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>*!/*/}
            {/*    /!*    {snackbarMessage}*!/*/}
            {/*    /!*</Alert>*!/*/}
            {/*</Snackbar>*/}
        </Box>
    );
};

export default CreateAccountForm;

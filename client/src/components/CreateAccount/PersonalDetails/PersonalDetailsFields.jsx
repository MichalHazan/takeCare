import React from "react";
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateField } from "./personalDetailsSlice"; // יבוא הפעולה של Redux

const PersonalDetailsFields = ({ openSnackbar, handleCloseSnackbar }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    // נתונים מ-Redux
    const {
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        role,
        gender,
        firstNameError,
        lastNameError,
        emailError,
        emailErrorMessage,
        phoneError,
        phoneErrorMessage,
    } = useSelector((state) => state.personalDetails);

    // עדכון Redux
    const handleChange = (field, value) => {

        dispatch(updateField({ field, value }));
        //console.log('emailError',emailError)
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {t("Create an account")}
            </Typography>
            <Box className="form-content">
                <Typography variant="subtitle1" gutterBottom>
                    {t("Personal details")}
                </Typography>

                <div className="fullName">
                    <TextField
                        label={t("First Name")}
                        variant="outlined"
                        value={firstName}
                        className="form-input"
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        error={firstNameError}
                        helperText={firstNameError ? t("Please enter a valid first name") : ""}
                        required
                    />
                    <p className="space"></p>
                    <TextField
                        label={t("Last Name")}
                        variant="outlined"
                        value={lastName}
                        className="form-input"
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        error={lastNameError}
                        helperText={lastNameError ? t("Please enter a valid last name") : ""}
                        required
                    />
                </div>

                <TextField
                    label={t("Username")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    required
                />
                <TextField
                    label={t("Email")}
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    error={emailError}
                    helperText={emailError ? emailErrorMessage : ""}
                />
                <TextField
                    label={t("Password")}
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    label={t("Mobile phone")}
                    type="tel"
                    variant="outlined"
                    className="form-input"
                    value={phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={phoneError}
                    helperText={phoneError ? phoneErrorMessage : ""}
                    required
                />
                <FormControl fullWidth className="form-input">
                    <InputLabel>{t("Gender")}</InputLabel>
                    <Select
                        value={gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        label={t("Gender")}
                        className="form-input"
                    >
                        <MenuItem value="male">{t("Male")}</MenuItem>
                        <MenuItem value="female">{t("Female")}</MenuItem>
                        <MenuItem value="other">{t("Other")}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default PersonalDetailsFields;

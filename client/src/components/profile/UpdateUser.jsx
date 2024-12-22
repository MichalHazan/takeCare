
import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import axiosInstance from "../../api/axiosConfig";
import { useTranslation } from "react-i18next";

const UpdateUser = () => {
    const { t } = useTranslation();
    const user = {
        user: {
            location: {
                type: "Point",
                coordinates: [35.0069297, 31.9085744],
            },
            _id: "67586f19854273bcb4b5141b",
            fullname: "Y",
            username: "Y",
            phone: "3333333",
            email: "Y",
            gender: "male",
            role: "professional",
            birthDate: "1990-01-01T00:00:00.000Z",
            createdAt: "2024-12-10T16:40:57.147Z",
            updatedAt: "2024-12-19T11:37:57.698Z",
        },
    };

    const [userId, setId] = useState(user.user._id || "");
    const [fullname, setFullname] = useState(user.fullname || "");
    const [username, setUsername] = useState(user.username || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [gender, setGender] = useState(user.gender || "");
    const [birthDate, setBirthDate] = useState(user.birthDate || "");
    const [city, setCity] = useState(user.location?.city || "");
    const [street, setStreet] = useState(user.location?.street || "");
    const [streetNumber, setStreetNumber] = useState(user.location?.streetNumber || "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Prepare the payload
            const payload = {
                fullname,
                username,
                email,
                phone,
                gender,
                birthDate: new Date(birthDate),
                location: {
                    city,
                    street,
                    streetNumber,
                },
            };

            // Send update request
            const response = await axiosInstance.put(`/api/users/update/${userId}`, payload);

            console.log("Update successful:", response.data);
            alert("User updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={4}
        >
            <Typography variant="h5" gutterBottom>
                {t("Update User Details")}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: "400px" }}>
                <TextField
                    label={t("Full Name")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <TextField
                    label={t("Username")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label={t("Email")}
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label={t("Phone")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>{t("Gender")}</InputLabel>
                    <Select
                        value={gender}
                        label={t("Gender")}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <MenuItem value="male">{t("Male")}</MenuItem>
                        <MenuItem value="female">{t("Female")}</MenuItem>
                        <MenuItem value="other">{t("Other")}</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label={t("Birth Date")}
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
                <TextField
                    label={t("City")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <TextField
                    label={t("Street")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
                <TextField
                    label={t("Street Number")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? t("Updating...") : t("Update")}
                </Button>
            </form>
        </Box>
    );
};

export default UpdateUser;

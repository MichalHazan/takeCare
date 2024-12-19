import React, { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Typography, Divider, Paper, IconButton, TextField, Button } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import {jwtDecode} from "jwt-decode";
import axiosInstance from "../../api/axiosConfig";

const ProfilePage = ({ userDetails }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();

    // State to handle editable field
    const [editableField, setEditableField] = useState(null);
    const [fieldValue, setFieldValue] = useState("");

    // Extract userId from access token
    const accessToken = localStorage.getItem("accessToken");
    let loggedInUserId = null;
    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        loggedInUserId = decodedToken.id;
    }

    // Display loading message if userDetails are not available
    if (!userDetails) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                <Typography>{t("Loading...")}</Typography>
            </Box>
        );
    }

    // Handle save for the edited field
    const handleSave = async () => {
        const updatedField = {
            [editableField]: fieldValue,
        };
        try {
            const response = await axiosInstance.put(
                `/api/users/update/${loggedInUserId}`,
                updatedField
            );
            console.log("Updated user details:", response.data);
        } catch (error) {
            console.error("Error updating user details:", error.response?.data || error.message);
        }
        setEditableField(null);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                direction: language === "he" ? "rtl" : "ltr",
                borderRadius: "10px",
                padding: 2,
                margin: "10px",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            {[
                { title: t("Full name"), value: userDetails?.user?.fullname || t("Not provided"), field: "fullname" },
                { title: t("Experience"), value: userDetails?.professionalDetails?.professions?.join(", ") || t("Not provided"), field: "professions" },
                { title: t("About me"), value: userDetails?.professionalDetails?.description || t("Not provided"), field: "description" },
                { title: t("Price range"), value: userDetails?.professionalDetails?.hourlyRate || t("Not provided"), field: "hourlyRate" },
                {
                    title: t("Location"),
                    value: `${userDetails?.user?.cityName || t("Not provided")}, ${userDetails?.user?.streetName || t("Not provided")}`,
                    field: "location",
                },
                {
                    title: t("Contact details"),
                    value: `${t("Phone")}: ${userDetails?.user?.phone || t("Not provided")}
                            ${t("Email")}: ${userDetails?.user?.email || t("Not provided")}`,
                },
            ].map((item, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {item.title}
                        </Typography>
                        {userDetails?.user?._id === loggedInUserId && (
                            <IconButton
                                onClick={() => {
                                    setEditableField(item.field);
                                    setFieldValue(item.value);
                                }}
                            >
                                <BorderColorIcon fontSize="small" sx={{ color: "#AB9798" }} />
                            </IconButton>
                        )}
                    </Box>
                    {editableField === item.field ? (
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                fullWidth
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                            />
                            <Button variant="contained" size="small" onClick={handleSave}>
                                {t("Save")}
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setEditableField(null)}
                            >
                                {t("Cancel")}
                            </Button>
                        </Box>
                    ) : (
                        <Typography sx={{ whiteSpace: "pre-line" }}>{item.value}</Typography>
                    )}
                    <Divider sx={{ marginY: 1 }} />
                </Box>
            ))}
        </Paper>
    );
};

export default ProfilePage;

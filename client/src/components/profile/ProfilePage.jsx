//ProfilePage
import React, { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Typography, Divider, Paper, IconButton, TextField, Button } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosConfig";

const ProfilePage = ({ userDetails }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();

    // State to handle editable fields
    const [editableField, setEditableField] = useState(null);
    const [fieldValue, setFieldValue] = useState("");

    // Handle save for the edited field
    const handleSave = async () => {
        try {
            const updatedField = { [editableField]: fieldValue };
            const response = await axiosInstance.put(
                `/api/users/update/${userDetails.user._id}`,
                updatedField
            );
            console.log("Updated user details:", response.data);
            userDetails.user[editableField] = fieldValue; // Update the local state to reflect changes
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
            {/* Editable Fields */}
            {[
                {
                    title: t("Full name"),
                    value: userDetails?.user?.fullname || t("Not provided"),
                    field: "fullname",
                },
                {
                    title: t("Professional Experience"),
                    value: userDetails?.professionalDetails?.professions?.join(", ") || t("Not provided"),
                    field: "professions",
                },
            ].map((item, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="bold">
                            {item.title}
                        </Typography>
                        <IconButton
                            onClick={() => {
                                setEditableField(item.field);
                                setFieldValue(item.value);
                            }}
                        >
                            <BorderColorIcon fontSize="small" sx={{ color: "#AB9798" }} />
                        </IconButton>
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

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
    const [loading, setLoading] = useState(false);

    // Handle save for the edited field
    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedField = { [editableField]: fieldValue };
            const response = await axiosInstance.put(
                `/api/users/update/${userDetails.user._id}`,
                updatedField
            );
            console.log("Updated user details:", response.data);
            userDetails.user[editableField] = fieldValue; // Update the local state to reflect changes
            userDetails.professionalDetails[editableField] = fieldValue; // Update the local state to reflect changes
            //alert(t("Changes saved successfully"));
        } catch (error) {
            console.error("Error updating user details:", error.response?.data || error.message);
            alert(t("Failed to save changes"));
        }
        setEditableField(null);
        setLoading(false);
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
            {[   // Editable fields
                {
                    title: t("Full Name"),
                    value: userDetails?.user?.fullname || t("Not provided"),
                    field: "fullname",
                },
                {
                    title: t("Professional Experience"),
                    value: userDetails?.professionalDetails?.professions?.join(", ") || t("Not provided"),
                    field: "professions",
                },
                {
                    title: t("Description"),
                    value: userDetails?.professionalDetails?.description || t("Not provided"),
                    field: "description",
                },
                {
                    title: t("Hourly Rate"),
                    value: userDetails?.professionalDetails?.hourlyRate || t("Not provided"),
                    field: "hourlyRate",
                },
                {
                    title: t("City Name"),
                    value: userDetails?.user?.cityName || t("Not provided"),
                    field: "cityName",
                },
                {
                    title: t("Street Name"),
                    value: userDetails?.user?.streetName || t("Not provided"),
                    field: "streetName",
                },
                {
                    title: t("Phone"),
                    value: userDetails?.user?.phone || t("Not provided"),
                    field: "phone",
                },
                {
                    title: t("Email"),
                    value: userDetails?.user?.email || t("Not provided"),
                    field: "email",
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
                            sx={{
                                border: editableField === item.field ? "2px solid #1976D2" : "none",
                                borderRadius: "5px",
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
                                disabled={loading}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {t("Save")}
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setEditableField(null)}
                                disabled={loading}
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

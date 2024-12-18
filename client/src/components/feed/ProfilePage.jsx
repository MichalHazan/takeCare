import React from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Typography, Divider, Paper, IconButton } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext"; // Importing language context for RTL/LTR direction
import { useTranslation } from "react-i18next"; // Importing translation functionality
import {jwtDecode} from "jwt-decode"; // Importing JWT decoding library

const ProfilePage = ({ userDetails }) => {
    const { language } = useLanguage(); // Retrieves the current language setting (e.g., "he" or "en")
    const { t } = useTranslation(); // Translation function for multi-language support

    // Extract the userId from the access token
    const accessToken = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
    let loggedInUserId = null;

    if (accessToken) {
        const decodedToken = jwtDecode(accessToken); // Decode the JWT token
        loggedInUserId = decodedToken.id; // Extract userId from the token payload
    }

    // Display a loading message if userDetails are not yet available
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
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                direction: language === "he" ? "rtl" : "ltr", // Change text direction based on language
                borderRadius: "10px", // Rounded corners for the Paper component
                padding: 2, // Inner spacing
                margin: "10px", // Outer spacing
                backgroundColor: "white", // White background color
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Subtle shadow for elevation
            }}
        >
            {/* Mapping through an array of profile details */}
            {[
                { title: t("ID"), value: userDetails?.user?._id || t("Not provided") },
                { title: t("Full name"), value: userDetails?.user?.fullname || t("Not provided") },
                { title: t("Experience"), value: userDetails?.professionalDetails?.professions || t("Not provided") },
                { title: t("About me"), value: userDetails?.professionalDetails?.description || t("Not provided") },
                { title: t("Price range"), value: userDetails?.professionalDetails?.hourlyRate || t("Not provided") },
                {
                    title: t("Location"),
                    value: userDetails?.professionalDetails?.location || t("Not provided"),
                },
                {
                    title: t("Contact details"),
                    value: `${t("Phone")}: ${userDetails?.user?.phone || t("Not provided")}
                            ${t("Email")}: ${userDetails?.user?.email || t("Not provided")}`,
                },
            ].map((item, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                    {/* Title with optional edit icon */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {item.title} {/* Translated title */}
                        </Typography>
                        {/* Display edit icon only if logged-in user matches the userDetails ID */}
                        {userDetails?.user?._id === loggedInUserId && (
                            <IconButton>
                                <BorderColorIcon fontSize="small" sx={{ color: "#AB9798" }} />
                            </IconButton>
                        )}
                    </Box>
                    {/* Display the value of each field */}
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                        {item.value}
                    </Typography>
                    {/* Divider for separation */}
                    <Divider sx={{ marginY: 1 }} />
                </Box>
            ))}
        </Paper>
    );
};

export default ProfilePage;

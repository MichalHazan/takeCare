//Margins.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";

const Margins = () => {
    const { language } = useLanguage();

    return (
        <Box
            sx={{
                backgroundColor: "rgb(171, 151, 152)", // צבע שוליים
                height: "10%", // גובה של השוליים
                position: "fixed", // מקבע בתחתית
                bottom: 0,
                left: 0,
                width: "100%",
                //zIndex: 900, // z-index נמוך מה-Navbar
                display: "flex",
                alignItems: "center",
                justifyContent: language === "he" ? "flex-end" : "flex-start",
                padding: "0 20px",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    color: "white",
                    fontFamily: "cursive",
                    fontSize: "1.2rem",
                }}
            >
                Take care
            </Typography>
        </Box>
    );
};

export default Margins;

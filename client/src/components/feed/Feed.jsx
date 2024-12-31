import React, { useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import ImageLayout from "./ImageLayout";
import ProfilePage from "../profile/ProfilePage";
import Recommendations from "../profile/Recommendations";
import { checkLogin, getLoggedInUser } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosConfig";

const imageT=["","","","",""]


export default function Feed() {
    const { t } = useTranslation();
    const [loginUser, setLoginUser] = useState({});
    const [userDetails, setUserDetails] = useState(null);
    const [imagesDetails, setImagesDetails] = useState(null);

    const navigate = useNavigate();


    // Check if the user is logged in
    useEffect(() => {
        if (!checkLogin()) {
            navigate('/login');
            return;
        }

        const user = getLoggedInUser();
        console.log('user', user);
        setLoginUser( user);
    }, [navigate]);


// Print loginUser after it's updated and fetch user details
    useEffect(() => {
        console.log('loginUser updated::', loginUser);

        const fetchUserDetails = async () => {
            try {
                if (loginUser && loginUser.id) { // Ensure user ID exists before making the call
                    console.log("Fetching user details for ID:", loginUser.id);
                    const response = await axiosInstance.get(`/api/users/user/${loginUser.id}`);
                    console.log('response.data:', response.data);

                    // Update state
                    setUserDetails(response.data);
                    setImagesDetails(response.data.professionalDetails?.images || []);
                } else {
                    console.warn("No loginUser or loginUser.id available.");
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };

        fetchUserDetails();
    }, [loginUser]); // Trigger when loginUser changes

// Log changes to userDetails
    useEffect(() => {
        console.log("Updated userDetails:", userDetails);
    }, [userDetails]);

// Log changes to imagesDetails
    useEffect(() => {
        console.log("Updated imagesDetails:", imagesDetails);
    }, [imagesDetails]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F5E7E7",
                height: "100%",
                padding: "20px 0",
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ProfilePage userDetails={userDetails} />
                </Grid>
                <Grid item xs={3}>
                    <Recommendations />
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{
                        height: "100%", // Fixed height for the container
                        width: "100%", // Adjusts the width to fit the grid container
                        overflow: "auto", // Enables scrolling if the content exceeds the container
                        backgroundColor: "#fff", // Background color (optional)
                        borderRadius: "8px", // Rounds the corners of the container (optional)
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adds a shadow effect (optional)
                        padding: "16px", // Internal padding for spacing
                    }}
                >
                    {imagesDetails ? (
                        <ImageLayout images={imagesDetails} />
                    ) : (
                        <div>
                            Loading images...
                        </div>
                    )}
                </Grid>

            </Grid>
        </Box>
    );
}

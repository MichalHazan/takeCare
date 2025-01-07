import React, { useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import ImageLayout from "./ImageLayout";
import ProfilePage from "../profile/ProfilePage";
import Recommendations from "../profile/Recommendations";
import { checkLogin, getLoggedInUser } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosConfig";
import { useParams } from "react-router-dom";





export default function Feed() {

    const { t } = useTranslation();
    const [userDetails, setUserDetails] = useState(null);
    const [imagesDetails, setImagesDetails] = useState(null);
    const [professionalId, setProfessionalId] = useState(null);


    const navigate = useNavigate();
    const { userId } = useParams();

    // Check if the user is logged in
    useEffect(() => {
        console.log('userIduserId',userId)
        if (!userId) {
            navigate('/');
            return;
        }
        const user = getLoggedInUser();
        console.log('user', user);
    }, [navigate]);


// Print loginUser after it's updated and fetch user details
    useEffect(() => {

        const fetchUserDetails = async () => {
            try {
                if (userId) { // Ensure user ID exists before making the call
                    const response = await axiosInstance.get(`/api/users/user/${userId}`);
                    console.log('response.data:', response.data);

                    // Update state
                    setUserDetails(response.data);
                    setImagesDetails(response.data.professionalDetails?.images || []);
                    setProfessionalId(response.data.professionalDetails?._id || []);

                } else {
                    console.warn("No loginUser or loginUser.id available.");
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };

        fetchUserDetails();
    }, [userId]); // Trigger when loginUser changes

// Log changes to userDetails
    useEffect(() => {
        console.log("Updated userDetailsFeed:", userDetails);
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
                    <ProfilePage userId={userId} />
                </Grid>
                <Grid item xs={3}>
                    <Recommendations professionalId={professionalId} />
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
                        <ImageLayout initialImages ={imagesDetails} userId={userId}/>
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

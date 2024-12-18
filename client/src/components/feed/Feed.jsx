import React, { useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import ImageLayout from "./ImageLayout";
import ProfilePage from "./ProfilePage";
import Recommendations from "./Recommendations";
import { checkLogin, getLoggedInUser } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosConfig";



export default function Feed() {
    const { t } = useTranslation();
    const [loginUser, setLoginUser] = useState({});
    const [userDetails, setUserDetails] = useState(null);
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

    // Print loginUser after it's updated
    useEffect(() => {
        console.log('loginUser updated1::', loginUser);

        const fetchUserDetails = async () => {
            try {
                console.log("fetchUserDetails updated::");
                console.log('loginUser',loginUser)
                if (loginUser && loginUser.id) { // Ensure user ID exists before making the call
                    console.log('AA')
                    const response = await axiosInstance.get(`http://localhost:2000/api/users/user/${loginUser.id}`);
                    console.log('BB')
                    console.log('User Details:', response.data);
                    setUserDetails(response.data);
                }
            } catch (err) {
                console.error("No user information found.", err);
            }
        };

        fetchUserDetails();
    }, [loginUser]); // Trigger when loginUser changes

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
                <Grid item xs={6}>
                    <ImageLayout />
                </Grid>
            </Grid>
        </Box>
    );
}

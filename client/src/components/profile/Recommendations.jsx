import React, {useEffect, useState} from "react";
import { Box, Typography, Paper } from "@mui/material";
import {Avatar, Card, CardContent, Rating, Stack,} from "@mui/material";
import { checkLogin, getLoggedInUser } from "../../utils/authUtils";
import axiosInstance from "../../api/axiosConfig";



const Recommendations = ({professionalId}) => {
    const [loginUser, setLoginUser] = useState(false);

    const [ReviewDetails, setReviewDetails] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/reviews/${professionalId}`);
                setReviewDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error.response?.data || error.message);
            }
        };

        const user = getLoggedInUser();
        if (user?.id) {
            setLoginUser(professionalId === user.id);
        }

        if (professionalId) fetchUserDetails();
    }, [professionalId]);

    useEffect(() => {
        console.log('ReviewDetails',ReviewDetails)
    },[ReviewDetails])



    return (
        <Box
            sx={{
                borderRadius: "8px",
                height: "100%",
                margin: "10px",
                backgroundColor: "#eee",
                flexDirection: "column",
                display: "flex",
                alignItems: "center", // Center content inside the image box
                //justifyContent: "center", // Center content inside the image box
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            <Typography
                variant="h6"
                align="center"
                sx={{ marginBottom: 2, fontWeight: "bold", color: "#5C5C5C" }}
            >
                מטופלים ממליצים
            </Typography>
            <Stack spacing={2}>
                {ReviewDetails.map((review, index) => (
                    <Card key={index} sx={{ boxShadow: "none", borderRadius: "8px" }}>
                        <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                            <Avatar
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "#F8C1C1" : "#D9D9D9",
                                    marginRight: 2,
                                }}
                            >
                                {review.customerId.username}
                            </Avatar>
                            <Box>
                                <Rating
                                    value={review.rating}
                                    readOnly
                                    precision={0.5}
                                    sx={{ fontSize: "1.2rem" }}
                                />
                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                    {review.comment}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ marginTop: 1, display: "block", color: "#888" }}
                                >
                                    {review.updatedAt}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default Recommendations;

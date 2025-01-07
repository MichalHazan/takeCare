import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { Avatar, Card, CardContent, Rating, Stack } from "@mui/material";
import { checkLogin, getLoggedInUser } from "../../utils/authUtils";
import axiosInstance from "../../api/axiosConfig";
import { useTranslation } from "react-i18next";


const Recommendations = ({ professionalId }) => {
    const { t } = useTranslation();

    const [loginUser, setLoginUser] = useState({});
    const [login, setLogin] = useState(false);

    const [ReviewDetails, setReviewDetails] = useState([]);
    const [newComment, setNewComment] = useState(""); // New comment field
    const [newRating, setNewRating] = useState(0); // New rating field

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/reviews/${professionalId}`);
                setReviewDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error.response?.data || error.message);
            }
        };

        const userLogin=checkLogin(professionalId);
        setLogin(userLogin)

        // const user = checkLogin(professionalId);
        // setLogin(user)
        // if (user?.id) {
        //     setLoginUser(professionalId === user.id);
        // }

        if (professionalId) fetchUserDetails();
    }, [professionalId,login]);

    const handleAddReview = async () => {
        if (!newComment || newRating === 0) {
            alert(t("fill_rating_and_comment"));
            return;
        }

        try {
            const newReview = {
                comment: newComment,
                rating: newRating,
                professionalId: professionalId,
            };
            const response = await axiosInstance.post(`/api/reviews`, newReview);
            setReviewDetails((prev) => [...prev, response.data]); // Add the review to the list
            setNewComment(""); // Reset the fields
            setNewRating(0);
        } catch (error) {
            console.error(t("error_adding_review"), error.response?.data || error.message);
        }
    };

    return (
        <Box
            sx={{
                borderRadius: "8px",
                height: "100%",
                margin: "10px",
                backgroundColor: "#eee",
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            <Typography
                variant="h6"
                align="center"
                sx={{ marginBottom: 2, fontWeight: "bold", color: "#5C5C5C" }}
            >
                {t("patient_recommendations")}
            </Typography>

            {login && (
                <Paper
                    elevation={2}
                    sx={{
                        padding: 2,
                        marginBottom: 2,
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                        {t("add_review")}
                    </Typography>
                    <Rating
                        value={newRating}
                        onChange={(e, newValue) => setNewRating(newValue)}
                        precision={0.5}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t("write_recommendation")}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddReview}>
                        {t("submit")}
                    </Button>
                </Paper>
            )}

            <Stack spacing={2} sx={{ width: "90%" }}>
                {ReviewDetails.map((review, index) => (
                    <Card key={index} sx={{ boxShadow: "none", borderRadius: "8px" }}>
                        <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                            <Avatar
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "#F8C1C1" : "#D9D9D9",
                                    marginRight: 2,
                                }}
                            >
                                {review.customerId?.username?.[0]?.toUpperCase() || "?"}
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

export default Recommendations
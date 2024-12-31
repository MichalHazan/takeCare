import React from "react";
import { Box, Typography } from "@mui/material";

const ImageGallery = ({ images = [] }) => {
    // Ensure the array contains at least 6 slots, even if there aren't enough images
    const imageList = images.map((image) => {
        try {
            return JSON.parse(image);
        } catch (e) {
            console.error("Invalid image JSON:", image);
            return null;
        }
    }).filter((image) => image !== null); // Filter out invalid entries

    const paddedImages = imageList.length < 9 ? [...imageList, ...Array(9 - imageList.length).fill(null)] : imageList;
    const slicedImages = paddedImages.slice(0, 20); // Always ensure only 6 items

    const fileNameUrl = (urlImage) => {
        // Extract the file name from the URL
        return decodeURIComponent(
            urlImage.substring(urlImage.lastIndexOf('/') + 1, urlImage.lastIndexOf('.'))
        );
    };

    return (
        <Box
            sx={{
                display: "grid", // Use grid layout to display images
                gridTemplateColumns: "repeat(3, 1fr)", // Three columns
                gap: 2, // Spacing between grid items
                padding: 2,
            }}
        >
            {slicedImages.map((image, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                    }}
                >
                    {/* Display the image or a placeholder if no image exists */}
                    {image ? (
                        <Box
                            component="img"
                            src={image.secure_url}
                            alt={`Image ${index + 1}`}
                            sx={{
                                width: "100%",
                                height: "200px", // Fixed height for the image
                                objectFit: "cover", // Ensures the image covers the box without distortion
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "200px",
                                backgroundColor: "#e0e0e0", // Gray background for placeholder
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "#999" }}>
                                No Image
                            </Typography>
                        </Box>
                    )}

                    {/* Display the asset ID only if secure_url exists */}
                    {image && (
                        <Typography
                            variant="caption"
                            sx={{ padding: 1, color: "#555", textAlign: "center" }}
                        >
                            {fileNameUrl(image.secure_url)}
                        </Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default ImageGallery;

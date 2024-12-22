import React from "react";
import { Box, Typography } from "@mui/material";

const ImageLayout = () => {
    return (
        <Box
            sx={{
                margin: "10px",
                display: "flex",
                height: "100vh",
                backgroundColor: "#eee",
                justifyContent: "center", // Center horizontally
                alignItems: "flex-start", // Align to the top vertically
                paddingTop: 2, // Optional padding for some spacing at the top
            }}
        >
            {/* Image Container */}
            <Box
                sx={{
                    width: "100%", // Full width of the container
                    maxWidth: "100%", // Set a maximum width for layout
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 images per row
                    gap: 2, // Spacing between images
                    padding: 2,
                }}
            >
                {/* Grid of 6 images */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "column", // Stack image and text vertically
                            alignItems: "center", // Center horizontally
                            justifyContent: "flex-start", // Align items to top
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            paddingBottom: "10px", // Space below the image
                        }}
                    >
                        {/* Image Placeholder */}
                        <Box
                            sx={{
                                borderRadius: "8px",
                                height: "150px", // Fixed height for the images
                                width: "100%", // Make sure the image box fits container
                                backgroundColor: "#ccc", // Placeholder background
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "8px", // Space between image and text
                            }}
                        >
                            <Typography>Image {index + 1}</Typography>
                        </Box>

                        {/* Image Caption */}
                        <Typography variant="caption" sx={{ color: "#555" }}>
                            Caption for Image {index + 1}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ImageLayout;

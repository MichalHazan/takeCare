import React, {useEffect, useState} from "react";
import { Box, Typography, Button } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import axiosInstance from "../../api/axiosConfig";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';



const ImageGallery = ({initialImages  = [] ,userId}) => {
    const [images, setImages] = useState(initialImages );
    const [uploadedFiles, setUploadedFiles] = useState([]); // שמירת הקבצים שנבחרו
    const [uploadProgress, setUploadProgress] = useState(0); // למעקב אחרי ההתקדמות

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        console.log("Uploaded files:", files);
        setUploadedFiles(files);
    };

    // פונקציה לשליחת הקובץ לשרת
    const handleUploadToServer = async () => {
        console.log("Upload To Server:");
        if (!uploadedFiles) {
            alert("Please select a file to upload!");
            return;
        }

        const formData = new FormData();
        uploadedFiles.forEach((file) => {
            formData.append("images", file);
        });
        try {
            const response = await axiosInstance.put(
                `/api/users/updateImages/${userId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // נדרש לשימוש ב-FormData
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    },
                });
            console.log("response.data:", response.data);
            console.log("response.data.updatedImages", response.data.images);
            setImages(response.data.images)
            console.log("Upload successful:", response.data);

        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };

    const handleDelete = async (public_id) => {
        if (!public_id) {
            console.error("No public_id provided for deletion");
            return;
        }
        console.log("handleDelete222", public_id);
        console.log("userId222", userId);

        try {
            // Sending the request with public_id in the body
            const response = await axiosInstance.put(
                `/api/users/DeleteImages/${userId}`, // URL
                { public_id } // Body
            );

            console.log("response.data:", response.data);
            console.log("response.data.updatedImages", response.data.updatedImages);
            setImages(response.data.updatedImages)
            // Optional: Handle UI update (e.g., remove image from list)
        } catch (error) {
            // Handle errors from Axios
            if (error.response) {
                console.error("Error response from server:", error.response.data);
            } else {
                console.error("Error sending request:", error.message);
            }
        }

    };


    // Ensure the array contains at least 6 slots, even if there aren't enough images
    const imageList = images.map((image) => {
        try {
            return JSON.parse(image);
        } catch (e) {
            console.error("Invalid image JSON:", image);
            return null;
        }
    }).filter((image) => image !== null); // Filter out invalid entries

    const paddedImages = imageList.length < 6 ? [...imageList, ...Array(6 - imageList.length).fill(null)] : imageList;
    //const slicedImages = paddedImages.slice(0, 6); // Always ensure only 6 items

    const fileNameUrl = (urlImage) => {
        // Extract the file name from the URL
        return decodeURIComponent(
            urlImage.substring(urlImage.lastIndexOf('/') + 1, urlImage.lastIndexOf('.'))
        );
    };
    useEffect(() => {
        if (uploadedFiles.length > 0) {
            handleUploadToServer(); // הפעלה אוטומטית של העלאה
        }
    }, [uploadedFiles]);

    const handleImageChange = async (public_id) => {
        await   handleDelete(public_id)
        // Logic to handle image Delete
        console.log(`Delete image at public_id ${public_id}`);
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
            {paddedImages.map((image, index) => (
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
                        position: "relative", // To position the button
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
                        ) :
                        (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "200px",
                                    backgroundColor: "", // Gray background for placeholder
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >

                            </Box>
                        )
                    }
                    {/* Display the asset ID only if secure_url exists */}
                    {image?.secure_url && (
                        <Typography
                            variant="caption"
                            sx={{ padding: 1, color: "#555", textAlign: "center" }}
                        >
                            {fileNameUrl(image.secure_url)}
                        </Typography>
                    )}

                    {/* Button to change the image */}
                    {image?.public_id && (
                        <Button
                            onClick={() => handleImageChange(image.public_id)}
                            sx={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                borderRadius: "50%",
                                padding: "4px",
                                minWidth: "auto",
                                height: "32px",
                                width: "32px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                '&:hover': {
                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                },
                            }}
                        >
                            <DeleteForeverOutlinedIcon sx={{ fontSize: "20px", color: "#333" }} />
                        </Button>
                    )}

                </Box>
            ))}
            <Button
                component="label"
                role={undefined}
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                    backgroundColor: "#FFCFCF", // שינוי צבע הרקע
                    color: "#333", // שינוי צבע הטקסט
                    '&:hover': {
                        backgroundColor: "#DA498D", // צבע בעת ריחוף
                        // F5E7E7
                    },
                }}
            >
                Upload Image
                <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    hidden
                />
            </Button>
        </Box>
    );
};

export default ImageGallery;

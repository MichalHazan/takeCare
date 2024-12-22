import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
//import BoxProfile from "./BoxProfile"


const EditableField = ({ title, value, field, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value);

    const handleSave = () => {
        onSave(field, fieldValue); // Call the parent save handler
        setIsEditing(false); // Exit edit mode
    };

    return (
        <Box sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2" fontWeight="bold">{title}</Typography>
                <IconButton onClick={() => setIsEditing(true)}>
                    <BorderColorIcon fontSize="small" sx={{ color: "#AB9798" }} />
                </IconButton>
            </Box>
            {isEditing ? (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", marginTop: 1 }}>
                    <TextField
                        fullWidth
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <Button variant="contained" size="small" onClick={handleSave}>
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setIsEditing(false);
                            setFieldValue(value); // Reset value on cancel
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            ) : (
                <Typography sx={{ whiteSpace: "pre-line", marginTop: 1 }}>{value}</Typography>
            )}
        </Box>
    );
};

export default EditableField;

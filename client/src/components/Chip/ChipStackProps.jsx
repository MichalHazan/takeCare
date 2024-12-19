import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import SingleChip from "./SingleChip";

export default function ChipStackProps({ initialChips = [], onSelectionChange }) {
    const [chipsState, setChipsState] = useState([]);

    // עדכון chipsState כאשר initialChips מתעדכן
    useEffect(() => {
        const transformedChips = initialChips.map((value, index) => ({
            id: index + 1,
            label: value,
            clicked: false,
            variant: "filled",
        }));
        setChipsState(transformedChips);
    }, [initialChips]);

    const handleChipClick = (id) => {
        setChipsState((prevState) =>
            prevState.map((chip) =>
                chip.id === id
                    ? {
                        ...chip,
                        clicked: !chip.clicked,
                        variant: chip.clicked ? "outlined" : "filled",
                    }
                    : chip
            )
        );
    };

    useEffect(() => {
        const selected = chipsState
            .filter((chip) => chip.clicked)
            .map((chip) => chip.label);
        if (onSelectionChange) {
            onSelectionChange(selected);
        }
    }, [chipsState, onSelectionChange]);

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap", // מאפשר שבירת שורות
                gap: 2, // רווח בין צ'יפים
                padding: "16px", // רווח פנימי
                border: "2px solid #ccc",
                borderRadius: "10px",
                maxWidth: "600px", // רוחב מקסימלי לקונטיינר
                maxHeight: "400px", // גובה מקסימלי
                overflowY: "auto", // גלילה אנכית במידת הצורך
                backgroundColor: "#f5f5f5",
            }}
        >
            {chipsState.map((chip) => (
                <SingleChip
                    key={chip.id}
                    id={chip.id}
                    variant={chip.variant}
                    clicked={chip.clicked}
                    onClick={handleChipClick}
                    label={chip.label}
                />
            ))}
        </Box>
    );
}

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createSlice } from "@reduxjs/toolkit";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

/** ======================= Redux Slice ======================= **/
const initialState = {
    professions: [],
    images:[],//הוספתי, הוסף את הפונקציות הדרושות
    services: {
        inPerson: true,
        viaZoom: false,
    },
    description: "",
    hourlyRate: "",
};

const professionalDetailsSlice = createSlice({
    name: "professionalDetails",
    initialState,
    reducers: {
        setProfessions(state, action) {
            state.professions = action.payload;
        },
        setService(state, action) {
            const { serviceType, isChecked } = action.payload;
            state.services[serviceType] = isChecked;
        },
        setDescription(state, action) {
            state.description = action.payload;
        },
        setHourlyRate(state, action) {
            state.hourlyRate = action.payload;
        },
    },
});

export const {
    setProfessions,
    setService,
    setDescription,
    setHourlyRate,
} = professionalDetailsSlice.actions;

export default professionalDetailsSlice.reducer;

/** ======================= Component ======================= **/
const ProfessionalFields = () => {
    const { t } = useTranslation(); // Hook for translations
    const dispatch = useDispatch();

    // Retrieve state values from Redux store
    const professions = useSelector((state) => state.professionalDetails.professions);
    const services = useSelector((state) => state.professionalDetails.services);
    const description = useSelector((state) => state.professionalDetails.description);
    const hourlyRate = useSelector((state) => state.professionalDetails.hourlyRate);

    // Profession options with translations
    const professionOptions = [
        { label: t("Fitness Trainer"), value: "fitness trainer" },
        { label: t("Yoga"), value: "yoga" },
        { label: t("Pilates"), value: "pilates" },
        { label: t("NLP"), value: "nlp" },
        { label: t("Psychology"), value: "psychology" },
        { label: t("Sociology"), value: "sociology" },
    ];


    return (
        <>
            <FormControl fullWidth margin="normal" required>
                <InputLabel>{t("Professions")}</InputLabel>
                <Select
                    multiple
                    value={professions}
                    onChange={(e) => {
                        const selectedValues = e.target.value;
                        dispatch(setProfessions(selectedValues));
                    }}
                    renderValue={(selected) =>
                        selected.map(value => {
                            const item = professionOptions.find(p => p.value === value);
                            return item ? item.label : value; // מציג את התרגום בעברית
                        }).join(", ")
                    }
                >
                    {professionOptions.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                            <Checkbox checked={professions.includes(value)}
                                      sx={{ color: "#fab28d", "&.Mui-checked": { color: "#fab28d" } }}
                            />
                            <Typography>{label}</Typography> {/* מציג את התרגום בעברית */}
                        </MenuItem>
                    ))}
                </Select>

            </FormControl>

            <FormControl fullWidth margin="normal">
                <Typography>{t("Services Offered")}</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{ color: "#fab28d", "&.Mui-checked": { color: "#fab28d" } }}
                            checked={services?.inPerson || false}
                            onChange={(e) =>
                                dispatch(setService({ serviceType: "inPerson", isChecked: e.target.checked }))
                            }
                        />
                    }
                    label={t("In-Person Services")}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{ color: "#fab28d", "&.Mui-checked": { color: "#fab28d" } }}
                            checked={services?.viaZoom || false}
                            onChange={(e) =>
                                dispatch(setService({ serviceType: "viaZoom", isChecked: e.target.checked }))
                            }
                        />
                    }
                    label={t("Online Services")}
                />
            </FormControl>

            <TextField
                label={t("Description")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={description}
                onChange={(e) => dispatch(setDescription(e.target.value))}
            />

            <TextField
                label={t("Hourly Rate")}
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={hourlyRate}
                onChange={(e) => dispatch(setHourlyRate(e.target.value))}
            />
        </>
    );
};

export { ProfessionalFields };

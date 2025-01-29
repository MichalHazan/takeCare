import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
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
import { setProfessions, setService, setDescription, setHourlyRate } from "./professionalDetailsSlice";

const ProfessionalFields = () => {
    const { t } = useTranslation(); // Hook לתרגומים
    const dispatch = useDispatch();

    // שליפת נתונים מה-Redux
    const professions = useSelector((state) => state.professionalDetails.professions);
    const services = useSelector((state) => state.professionalDetails.services);
    const description = useSelector((state) => state.professionalDetails.description);
    const hourlyRate = useSelector((state) => state.professionalDetails.hourlyRate);

    // אפשרויות המקצועות עם תרגומים
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
            {/* בחירת מקצוע */}
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

            {/* בחירת סוגי שירותים */}
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

            {/* תיאור מקצועי */}
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

            {/* מחיר לשעה */}
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

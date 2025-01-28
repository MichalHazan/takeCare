//DateBirth.jsx
import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateDate, validateDate as validateReduxDate } from "./dateSlice"; // יבוא הפעולות מ-Redux

const DateBirth = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // הבאת נתונים מ-Redux
    const { day, month, year, dateError, DateErrorMessage } = useSelector((state) => state.date);
    // עדכון Redux במידע החדש
    const handleDayChange = (e) => {
        dispatch(updateDate({ key: "day", value: e.target.value }));
    };

    const handleMonthChange = (e) => {
        dispatch(updateDate({ key: "month", value: e.target.value }));
    };

    const handleYearChange = (e) => {
        dispatch(updateDate({ key: "year", value: e.target.value }));
    };



    const months = [
        { value: 1, label: t("January") },
        { value: 2, label: t("February") },
        { value: 3, label: t("March") },
        { value: 4, label: t("April") },
        { value: 5, label: t("May") },
        { value: 6, label: t("June") },
        { value: 7, label: t("July") },
        { value: 8, label: t("August") },
        { value: 9, label: t("September") },
        { value: 10, label: t("October") },
        { value: 11, label: t("November") },
        { value: 12, label: t("December") },
    ];

    return (
        <>
        <Box className="form-row">
            <TextField
                label={t("Day")}
                value={day || ""}
                type="number"
                variant="outlined"
                className="form-small-input"
                onChange={handleDayChange}
                required
            />
            <FormControl className="form-small-input">
                <InputLabel>{t("Month")}</InputLabel>
                <Select
                    value={month || ""}
                    label={t("Month")}
                    onChange={handleMonthChange}
                    required
                >
                    {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                            {t(month.label)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label={t("Year")}
                value={year || ""}
                type="number"
                variant="outlined"
                className="form-small-input"
                onChange={handleYearChange}
                required
            />
        </Box>
            {dateError && <div className="dateError">{t("This field is required, please enter a valid date")}</div>}
        </>
    );
};

export default DateBirth;

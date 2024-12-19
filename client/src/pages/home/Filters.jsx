import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Button,
  Typography,
  Slider,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Filters = ({ users, setFilteredUsers }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({
    gender: "",
    professions: [],
    serviceInPerson: false,
    serviceZoom: false,
    hourlyRate: [0, 100],
    description: "",
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilter({ ...filter, [name]: checked });
  };

  const handleProfessionsChange = (e) => {
    const { value, checked } = e.target;
    const updatedProfessions = checked
      ? [...filter.professions, value]
      : filter.professions.filter((prof) => prof !== value);
    setFilter({ ...filter, professions: updatedProfessions });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSliderChange = (event, newValue) => {
    setFilter({ ...filter, hourlyRate: newValue });
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filter by gender
    if (filter.gender) {
      filtered = filtered.filter((user) => user.gender === filter.gender);
    }

    // Filter by professions
    if (filter.professions.length > 0) {
      filtered = filtered.filter((user) =>
        filter.professions.some((prof) => user.professions.includes(prof))
      );
    }

    // Filter by services
    if (filter.serviceInPerson) {
      filtered = filtered.filter((user) => user.services.inPerson);
    }

    if (filter.serviceZoom) {
      filtered = filtered.filter((user) => user.services.viaZoom);
    }

    // Filter by hourly rate
    filtered = filtered.filter(
      (user) =>
        user.hourlyRate >= filter.hourlyRate[0] &&
        user.hourlyRate <= filter.hourlyRate[1]
    );

    // Filter by description
    if (filter.description) {
      filtered = filtered.filter((user) =>
        user.description.toLowerCase().includes(filter.description.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: 3,
        width: "100%",
        maxWidth: "450px",
       
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ fontWeight: "bold", color: "#444", marginBottom: "16px" }}
      >
        {t("Filter Users")}
      </Typography>

     

      {/* Profession filter */}
      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {t("Professions")}
        </Typography>
        <FormGroup>
          {["nlp", "yoga", "nutritionist"].map((profession) => (
            <FormControlLabel
              key={profession}
              control={
                <Checkbox
                  checked={filter.professions.includes(profession)}
                  onChange={handleProfessionsChange}
                  value={profession}
                />
              }
              label={<Typography>{t(profession)}</Typography>}
            />
          ))}
        </FormGroup>
      </FormControl>
       {/* Gender filter */}
       <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>
          {t("Gender")}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.gender === "male"}
                onChange={(e) =>
                  setFilter({ ...filter, gender: e.target.checked ? "male" : "" })
                }
                name="gender"
              />
            }
            label={<Typography>{t("Male")}</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.gender === "female"}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    gender: e.target.checked ? "female" : "",
                  })
                }
                name="gender"
              />
            }
            label={<Typography>{t("female")}</Typography>}
          />
        </FormGroup>
      </FormControl>

      {/* Services filter */}
      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {t("Services")}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.serviceInPerson}
                onChange={handleCheckboxChange}
                name="serviceInPerson"
              />
            }
            label={<Typography>{t("In-Person")}</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.serviceZoom}
                onChange={handleCheckboxChange}
                name="serviceZoom"
              />
            }
            label={<Typography>{t("Via Zoom")}</Typography>}
          />
        </FormGroup>
      </FormControl>

      {/* Hourly Rate filter */}
      <FormControl sx={{ marginBottom: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {t("Hourly Rate")}
        </Typography>
        <Slider
          value={filter.hourlyRate}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => <Typography>{value}$</Typography>}
          min={0}
          max={200}
          step={10}
        />
      </FormControl>

      {/* Description filter */}
      <FormControl sx={{ marginBottom: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {t("Description")}
        </Typography>
        <TextField
          placeholder={t("Search by description")}
          variant="outlined"
          value={filter.description}
          onChange={handleInputChange}
          name="description"
        />
      </FormControl>
      

      <Button
        variant="contained"
        color="primary"
        onClick={applyFilters}
        sx={{
          padding: "12px",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        {t("Apply Filters")}
      </Button>
    </Box>
  );
};

export default Filters;

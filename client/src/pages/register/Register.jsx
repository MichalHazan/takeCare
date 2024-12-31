import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import axiosInstance from '../../api/axiosConfig';
import { useLanguage } from '../../context/LanguageContext';
import Geocode from "react-geocode";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { pink } from '@mui/material/colors';
import "./styles.module.css"; // ייבוא קובץ העיצוב

// Constants
const API_URL = "https://data.gov.il/api/3/action/datastore_search";
const CITIES_RESOURCE_ID = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const STREETS_RESOURCE_ID = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const CITY_NAME_KEY = "שם_ישוב";
const STREET_NAME_KEY = "שם_רחוב";

// Utility function to get current location coordinates
const getLocationCoordinates = async (city, street, streetNumber) => {
    debugger
    try {
        // Validate manual location fields
        if (!city || !street || !streetNumber) {
            throw new Error("Manual location details are incomplete");
        }

        // Use geocoding to convert address to coordinates
        const fullAddress = ` ${city},${street} ${streetNumber}`;
        const geocodeResult = await Geocode.fromAddress(fullAddress);

        return {
            type: 'Point',
            coordinates: [
                geocodeResult.longitude,
                geocodeResult.latitude
            ]
        };
    } catch (geocodeError) {
        // If all location methods fail, throw a comprehensive error
        throw new Error("Unable to determine location. Please provide precise address details.");
    }

};

const Register = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  //users basic information
  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(null);
  const [gender, setGender] = useState("");

  // users berth date
  const [birthDate, setBirthDate] = useState("");
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  // users location
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [streetNumber, setStreetNumber] = useState("");
  const [coordinates, setCoordinates] = useState(null);


  const [locationError, setLocationError] = useState(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [manualLocationConfirmed, setManualLocationConfirmed] = useState(false);






  // Professional-specific information
  const [role, setRole] = useState("customer");
  const [isProfessional, setIsProfessional] = useState(false);
  const [professions, setProfessions] = useState([]);
  const [services, setServices] = useState({
      inPerson: true,
      viaZoom: false
  });
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const professionOptions = [
      'fitness trainer',
      'yoga',
      'pilates',
      'nlp',
      'psychology',
      'sociology'
  ];

  // Error and loading states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch coordinates using OpenStreetMap Nominatim
  const fetchCoordinates = async (city, street) => {
      if (!city || !street) return null;

      try {


          const response = await axios.get(
              "https://nominatim.openstreetmap.org/search",
              {
                  params: {
                      q: `${street}, ${city}, Israel`,
                      format: "json",
                      limit: 1,
                  }
              }
          );

          if (response.data && response.data.length > 0) {
              const { lat, lon } = response.data[0];
              return [parseFloat(lat), parseFloat(lon)];
          }
          return null;
      } catch (error) {
          console.error("Failed to fetch coordinates", error);
          return null;
      }
  };

  // Existing city and street fetching logic remains the same...
  useEffect(() => {
      const fetchCities = async () => {
          try {
              const response = await axios.get(API_URL, {
                  params: {
                      resource_id: CITIES_RESOURCE_ID,
                      limit: 32000,
                  },
              });

              const cityNames = response.data.result.records
                  .map((city) => city[CITY_NAME_KEY].trim())
                  .sort();

              setCities(cityNames);
          } catch (error) {
              console.error("Failed to fetch cities", error);
          }
      };

      fetchCities();
  }, []);

  useEffect(() => {
      const fetchStreets = async () => {
          if (!selectedCity) {
              setStreets([]);
              return;
          }

          try {
              const queryParam = JSON.stringify({
                  [CITY_NAME_KEY]: selectedCity,
              });

              const response = await axios.get(API_URL, {
                  params: {
                      resource_id: STREETS_RESOURCE_ID,
                      q: queryParam,
                      limit: 32000,
                  },
                  paramsSerializer: (params) => {
                      return Object.entries(params)
                          .map(
                              ([key, value]) =>
                                  `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                          )
                          .join("&");
                  },
              });

              const streetNames = response.data.result.records
                  .map((street) => street[STREET_NAME_KEY].trim())
                  .sort();

              setStreets(streetNames);
          } catch (error) {
              console.error("Failed to fetch streets", error);
          }
      };

      fetchStreets();
  }, [selectedCity]);

  // Fetch coordinates when city and street are selected
  useEffect(() => {
      const getCoordinates = async () => {
          if (selectedCity && selectedStreet) {
              const coords = await fetchCoordinates(selectedCity, selectedStreet);
              setCoordinates(coords);
          }
      };

      getCoordinates();
  }, [selectedCity, selectedStreet]);

  //----------------------------------------------------------------------------------



  const handleProfessionChange = (event) => {
      const { value } = event.target;
      setProfessions(
          typeof value === 'string' ? value.split(',') : value
      );
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
      { value: 12, label: t("December") }
  ];

  useEffect(() => {
      if (day && month && year) {
          // Format the date as "YYYY-MM-DD"
          const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          setBirthDate(formattedDate);
      }
  }, [day, month, year]);

  const validateName = (name) => {
      return name.trim().length > 0; // ודא שהשם אינו ריק
  };

  const validatePhone = (phone) => {
      const phoneRegex = /^(?:(?:\+|00)972?)?0?([23489]\d{7})$/;
      return phoneRegex.test(phone); // ודא שהטלפון תקין
  };

  const validateDate = (day, month, year) => {

      return day > 0 && day <= 31 && month > 0 && month <= 12 && year > 0; // ודא שהתאריך תקין
  };

  const handleNameChange = (e) => {
      const value = e.target.value;
      if (validateName(value)) {
          console.log('שם תקין');
      } else {
          console.log('שם אינו תקין');
      }
  };

  const handlePhoneChange = (e) => {
      const value = e.target.value;
      setPhone(value);
      if (validatePhone(value)) {
          console.log('מספר הטלפון תקין');
      } else {
          console.log('מספר הטלפון נייד אינו תקין');
      }
  };

  const handleDateChange = () => {
      if (validateDate(day, month, year)) {
          console.log('תאריך תקין');
      } else {
          console.log('תאריך אינו תקין');
      }
  };



  const handleSubmit = async (e) => {

      e.preventDefault();
      setIsLoading(true);
      setError("");
      //setError("");
      setLocationError(null);
      let fullname = `${firstName} ${lastName}`;
      let cityName = selectedCity;
      let streetName = selectedStreet;
      let images = "";
      

      try {
            // Get location coordinates
          let location = { "type": "Point", "coordinates": [35.2137, 31.7683] };
        
          const payload = {
              fullname,
              username,
              email,
              password,
              phone,
              gender,
              birthDate: new Date(birthDate),
              location,
              cityName,
              streetName,              
              role: isProfessional ? 'professional' : 'customer',
              ...(isProfessional && {
                  professions,
                  services,
                  description,
                  images,
                  hourlyRate: parseFloat(hourlyRate)
              })
          };
          console.log(payload)
          const response = await axiosInstance.post("/api/users/register", payload);

          console.log("Registration successful:", response.data);
          // Handle successful registration (e.g., redirect, show success message)
      } catch (err) {
          setError(err.response?.data?.message || "Registration failed. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };






  return (
      <Box className="form-container">
          <Typography variant="h5" gutterBottom>
              יצירת חשבון
          </Typography>
          <Box className="form-content">
              <Typography variant="subtitle1" gutterBottom>
                  פרטים אישיים
              </Typography>
              <div className="fullName">
                  <TextField
                      label={t("First Name")}
                      variant="outlined"
                      value={firstName}
                      className="form-input"
                      onChange={(e) => {
                          setFirstName(e.target.value);
                          handleNameChange(e);
                      }}
                      required
                  />
                  <p className="space"></p>
                  <TextField
                      label={t("Last Name")}
                      variant="outlined"
                      className="form-input"
                      value={lastName}
                      onChange={(e) => {
                          setLastName(e.target.value);
                          handleNameChange(e);
                      }}
                      required
                  />
              </div>

              <TextField
                  label={t("Username")}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <TextField
                  label={t("Email")}
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <TextField
                  label={t("password")}
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />

              <TextField
                  fullWidth
                  label={t("Mobile phone")}
                  type="tel"
                  variant="outlined"
                  className="form-input"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
              />

              <Box className="form-row">
                  <TextField
                      label={t("Day")}
                      value={day}
                      type="number"
                      variant="outlined"
                      className="form-small-input"
                      onChange={(e) => {
                          setDay(e.target.value);
                          handleDateChange();
                      }}
                      required
                  />
                  <FormControl className="form-small-input">
                      <InputLabel>{t("Month")}</InputLabel>
                      <Select
                          value={month}
                          label={t("Month")}
                          onChange={(e) => {
                              setMonth(e.target.value);
                              handleDateChange();
                          }}
                          required
                      >
                          {months.map((month) => (
                              <MenuItem key={month.value} value={month.value}>
                                  {month.label}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <TextField
                      label={t("Year")}
                      value={year}
                      type="number"
                      variant="outlined"
                      className="form-small-input"
                      onChange={(e) => {
                          setYear(e.target.value);
                          handleDateChange();
                      }}
                      required
                  />
              </Box>
              <FormControl fullWidth className="form-input">
                  <InputLabel>{t("Gender")}</InputLabel>
                  <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      label={t("Gender")}
                      color="pinkCare">
                      <MenuItem value="male">{t("Male")}</MenuItem>
                      <MenuItem value="female">{t("Female")}</MenuItem>
                      <MenuItem value="other">{t("Other")}</MenuItem>
                  </Select>
              </FormControl>

              <FormControl fullWidth className="form-input">
                  <InputLabel>{t("City")}</InputLabel>
                  <Autocomplete
                      options={cities}
                      value={selectedCity}
                      onChange={(_, newValue) => {
                          setSelectedCity(newValue);
                          setSelectedStreet(null);
                          setCoordinates(null);
                      }}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              label={t("City")}
                              variant="outlined"
                              fullWidth
                          />
                      )}
                  />
              </FormControl>
                  <FormControl fullWidth className="form-input">
                      <InputLabel>{t("Street")}</InputLabel>
                      <Autocomplete
                          options={streets}
                          value={selectedStreet}
                          onChange={(_, newValue) => setSelectedStreet(newValue)}
                          disabled={!selectedCity}
                          renderInput={(params) => (
                              <TextField
                                  {...params}
                                  label={t("Street")}
                                  variant="outlined"
                                  fullWidth
                                  disabled={!selectedCity}
                              />
                          )}
                      />
                  </FormControl>
                  <p className="space"></p>
            

              <FormControlLabel
                  control={<Checkbox
                      sx={{ color: pink[400], '&.Mui-checked': { color: pink[300] } }}
                      checked={isProfessional}
                      onChange={(e) => {
                          setIsProfessional(e.target.checked);
                          setRole(e.target.checked ? 'professional' : 'customer');
                      }}
                  />}
                  label={t("I would also like to join as a therapist")}
                  className="form-checkbox"
              />


              {/* Professional Details (Conditionally Rendered) */}
              {isProfessional && (
                  <>
                      <FormControl fullWidth margin="normal" required>
                          <InputLabel>Professions</InputLabel>
                          <Select
                              label="Professions"
                              multiple
                              value={professions}
                              onChange={handleProfessionChange}
                              renderValue={(selected) => selected.join(', ')}
                          >
                              {professionOptions.map((profession) => (
                                  <MenuItem key={profession} value={profession}>
                                      <Checkbox checked={professions.includes(profession)} />
                                      {profession}
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                          <Typography>Services Offered</Typography>
                          <FormControlLabel
                              control={
                                  <Checkbox
                                      sx={{ color: pink[400], '&.Mui-checked': { color: pink[300] } }}
                                      checked={services.inPerson}
                                      onChange={(e) => setServices(prev => ({
                                          ...prev,
                                          inPerson: e.target.checked
                                      }))}
                                  />
                              }
                              label="In-Person Services"
                          />
                          <FormControlLabel
                              control={
                                  <Checkbox
                                      sx={{ color: pink[400], '&.Mui-checked': { color: pink[300] } }}
                                      checked={services.viaZoom}
                                      onChange={(e) => setServices(prev => ({
                                          ...prev,
                                          viaZoom: e.target.checked
                                      }))}
                                  />
                              }
                              label="Online (Zoom) Services"
                          />
                      </FormControl>

                      <TextField
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          margin="normal"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                      />

                      <TextField
                          label="Hourly Rate"
                          type="number"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                      />
                  </>
              )}



              <Button onClick={handleSubmit} className="creatTheAcount" fullWidth variant="contained">
                  יצירת חשבון
              </Button>
          </Box>

      </Box>




  );
};


export default Register;
import React, { useState } from "react";
import { 
  Alert, 
  Box, 
  Button, 
  Checkbox, 
  FormControl, 
  FormControlLabel, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography 
} from "@mui/material";
import axiosInstance from '../../api/axiosConfig';
import Geocode from "react-geocode";

// Utility function to get current location coordinates
const getLocationCoordinates = async (city, street, streetNumber) => {
    try {
      // Validate manual location fields
      if (!city || !street || !streetNumber) {
        throw new Error("Manual location details are incomplete");
      }

      // Use geocoding to convert address to coordinates
      const fullAddress = `${streetNumber} ${street}, ${city}`;
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
  // Basic user information
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [locationError, setLocationError] = useState(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [manualLocationConfirmed, setManualLocationConfirmed] = useState(false);

  // Location information
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  
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
  
  // Error and loading states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Profession list (matching your schema)
  const professionOptions = [
    'fitness trainer', 
    'yoga', 
    'pilates', 
    'nlp', 
    'psychology', 
    'sociology'
  ];

  const handleProfessionChange = (event) => {
    const { value } = event.target;
    setProfessions(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setError("");
    setLocationError(null);

    try {
      // Get location coordinates
      let location;
      try {
        location = await getLocationCoordinates(city, street, streetNumber);
      } catch (locationErr) {
        // Open dialog to confirm manual location or retry
        setLocationError(locationErr.message);
        setIsLocationDialogOpen(true);
        setIsLoading(false);
        return;
      }

      // Prepare registration payload
      const payload = {
        fullname,
        username,
        email,
        password,
        phone,
        gender,
        birthDate: new Date(birthDate),
        location,
        role: isProfessional ? 'professional' : 'customer',
        ...(isProfessional && {
          professions,
          services,
          description,
          hourlyRate: parseFloat(hourlyRate)
        })
      };

      // Send registration request
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={4}
    >
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ width: "400px" }}>
        {/* Basic User Information */}
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* Location Information */}
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <TextField
          label="Street"
          variant="outlined"
          fullWidth
          margin="normal"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />
        <TextField
          label="Street Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={streetNumber}
          onChange={(e) => setStreetNumber(e.target.value)}
          required
        />

        {/* Additional User Details */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            label="Gender"
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Birth Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />

        {/* Professional Option */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isProfessional}
              onChange={(e) => {
                setIsProfessional(e.target.checked);
                setRole(e.target.checked ? 'professional' : 'customer');
              }}
            />
          }
          label="Are you a Professional?"
        />

        {/* Professional Details (Conditionally Rendered) */}
        {isProfessional && (
          <>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Professions</InputLabel>
              <Select
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

        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          fullWidth 
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Box>
  );
};

export default Register;
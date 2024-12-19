import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from '../../api/axiosConfig';
import ChipStackProps from '../../components/Chip/ChipStackProps';

const Register = () => {
  const [listProfessions, setlistProfessions] = useState([]);
  const [selectedProfessions, setSelectedProfessions] = useState([]);

  useEffect(() => {
    const fetchlistProfessions = async () => {
      try {
        const response = await axiosInstance.get("/api/professionsList");
        setlistProfessions(response.data.map((item) => item));
      } catch (error) {
        console.error('Error fetching profession types:', error);
      }
    };

    fetchlistProfessions();
  }, []);

  const handleSelectionChange = (selected) => {
    console.log("Selected professions:", selected);
    setSelectedProfessions(selected);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const locationTest = { "type": "Point", "coordinates": [35.2137, 31.7683] };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    role: "",
    birthDate: "",
    professions: "",
    location: locationTest,
    services: { inPerson: false, viaZoom: false },
    description: "",
    images: "",
    hourlyRate: "",
  });
  const [showProfessions, setShowProfessions] = useState(false);

  const travelTo = (dest) => {
    navigate("/" + dest);
  };

  useEffect(() => {
    if (location.pathname === "/register") {
      setOpen(true);
    }
  }, [location]);

  const handleClose = () => {
    setOpen(false);
    travelTo("Home");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (name.startsWith("services.")) {
        const service = name.split(".")[1];
        return {
          ...prev,
          services: {
            ...prev.services,
            [service]: checked,
          },
        };
      }
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    if (name === "role") {
      setShowProfessions(value === "professional");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data to be sent:", formData);

    try {
      const response = await axiosInstance.post("/api/users/register", formData);
      console.log("Registration successful:", response.data);
    } catch (err) {
      console.error("Registration failed:", err.response ? err.response.data : err.message);
    }
  };


  useEffect(() => {
    const isEqual = JSON.stringify(formData.professions) === JSON.stringify(selectedProfessions);

    if (!isEqual) {
      setFormData((prev) => ({
        ...prev,
        professions: [...selectedProfessions],
      }));
      console.log("Updated professions:", selectedProfessions);
    }
  }, [selectedProfessions]);



  return (
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="register-modal-title"
          aria-describedby="register-modal-description"
      >
        <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              maxWidth: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 2,
            }}
        >
          <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
          >
            <Typography variant="h5" id="register-modal-title">
              Register
            </Typography>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
                label="Full Name"
                name="fullname"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.fullname}
                onChange={handleChange}
            />
            <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
            />
            <TextField
                label="Phone"
                name="phone"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
            />
            <TextField
                label="Birth Date"
                name="birthDate"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true, // מאפשר לתווית להופיע מעל שדה התאריך
                }}
                value={formData.birthDate}
                onChange={handleChange}
            />
            <TextField
                label="Gender"
                name="gender"
                select
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.gender}
                onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <TextField
                label="Role"
                name="role"
                select
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.role}
                onChange={handleChange}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>//למה הערך לא נקלט ?
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            {showProfessions && (
                <>
                  <ChipStackProps
                      initialChips={listProfessions}
                      onSelectionChange={(selected) => setSelectedProfessions(selected)}
                  >
                  </ChipStackProps>


                  <TextField
                      label="Description"
                      name="description"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                  />
                  <FormGroup>
                    <FormControlLabel
                        control={
                          <Checkbox
                              name="services.inPerson"
                              checked={formData.services.inPerson}
                              onChange={handleChange}
                          />
                        }
                        label={<Typography variant="body1">In-Person Services</Typography>}
                    />
                    <FormControlLabel
                        control={
                          <Checkbox
                              name="services.viaZoom"
                              checked={formData.services.viaZoom}
                              onChange={handleChange}
                          />
                        }
                        label={<Typography variant="body1">Via Zoom Services</Typography>}
                    />
                  </FormGroup>

                  <TextField
                      label="Hourly Rate"
                      name="hourlyRate"
                      type="number"
                      inputProps={{ min: 0 }}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                  />
                </>
            )}

            <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>
        </Box>
      </Modal>
  );
};


export default Register;
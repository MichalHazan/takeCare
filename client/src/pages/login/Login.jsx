import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { checkLogin } from "../../utils/authUtils";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    pinkCare: {
      main: '#ffabab',
      light: '#f9caca',
      dark: '#fd9999',
      contrastText: '#604645',
    },
  },
});


const Login = () => {
  const { t } = useTranslation();
  const [login, setLogin] = useState(""); // Changed from email to login
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (checkLogin()) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/login", {
        login, // Changed from email to login
        password,
      });
      
      // Store tokens
      localStorage.setItem("accessToken", response.data.token);

      // Navigate to feed
      navigate("/Feed");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        {t("Login")}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <TextField
        color="pinkCare"
          label={t("Email or Username")} // Updated label
          variant="outlined"
          fullWidth
          margin="normal"
          value={login} // Changed from email to login
          onChange={(e) => setLogin(e.target.value)} // Changed from setEmail to setLogin
        />
        <TextField
        color="pinkCare"
          label={t("password")}
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="pinkCare" type="submit" fullWidth sx={{ fontWeight: "bold" }}>
          {t("Login")}
        </Button>
      </form>

      <p className={styles.text}>
        {t("New Here")} ? <Link to="/register">{t("register")}</Link>
      </p>
    </Box>
  );
};

export default Login;
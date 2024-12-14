import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axiosInstance from "../../api/axiosConfig";
import { checkLogin } from "../../utils/authUtils";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { checkLogin } from '../../utils/authUtils';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    if (checkLogin()) {
      navigate("/home");
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/Feed');
    }
  }, [navigate]);

  // Regular login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });

      // Store tokens
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);

      // Navigate to feed
      navigate("/Feed");
      const response = await axiosInstance.post('/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/Feed'); // Redirect to Feed page after successful login
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Full Credential Response:", credentialResponse);

      // Send the entire credential object to backend
      const response = await axiosInstance.post(
        "/api/auth/google/login",
        {
          token: credentialResponse.credential,
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Store tokens
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      console.log(response.data.user);
      navigate(
        response.data.user.role === "professional"
          ? "/professional-dashboard"
          : "/Feed"
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Google login failed. Please try again."
      );
      console.error("Detailed Google Login Error:", {
        response: err.response?.data,
        message: err.message,
        stack: err.stack,
      });
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      cookiePolicy={"single_host_origin"}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h5" gutterBottom>
          {t("Login")}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
          <TextField
            label={t("Email")}
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label={t("password")}
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            {t("Login")}
          </Button>
        </form>

        <Typography variant="body1" gutterBottom>
          {t("or")}
        </Typography>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={(error) => {
            console.error("Google Login Error:", error);
            setError("Google login failed. Please try again.");
          }}
          useOneTap
          context="signin"
          type="standard"
        />

        <p className={styles.text}>
          {t("New Here")} ? <Link to="/register">{t("register")}</Link>
        </p>
      </Box>
    </GoogleOAuthProvider>
  return (<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
          <Typography variant="h5" gutterBottom>{t("Login")}</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit} style={{ width: "300px" }}>
            <TextField
                label={t("Email")}
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label={t("Password")}
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {t("Login")}
            </Button>
          </form>
          <Typography variant="body1" gutterBottom>
            {t("or")}
          </Typography>
          <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const token = credentialResponse.credential; // Get the token from Google
                  console.log("Google Token Received:", token);

                  // Send the token to the server for verification and get a custom token
                  const serverResponse = await axiosInstance.post('/auth/google', { token });
                  localStorage.setItem('token', serverResponse.data.token); // Save the token
                  navigate('/Feed'); // Redirect to Feed page after successful login
                } catch (err) {
                  console.error("Error during Google Login:", err);
                  setError("Google Login failed. Please try again.");
                }
              }}

              onError={() => {
                setError("Google Login failed. Please try again.");
              }}
          />
        </Box>
      </GoogleOAuthProvider>
  );
};

export default Login;

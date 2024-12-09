import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
      const response = await axiosInstance.post('/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/Feed'); // Redirect to Feed page after successful login
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

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

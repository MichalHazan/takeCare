import axiosInstance from '../api/axiosConfig';
import { jwtDecode } from "jwt-decode";

export const checkLogin = () => {
  const token = localStorage.getItem("accessToken");
  // Return false if no token exists
  if (!token) {
    return false;
  }
  return true;
};

export const getLoggedInUser = () => {
  const token = localStorage.getItem("accessToken");
  // Return null if no token exists
  if (!token) {
    return null;
  }
  try {
    // Decode and return user data from token
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
// Decode JWT token
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/refresh-token', {
      token: localStorage.getItem('token')
    });
    
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    // Logout user if refresh fails
    logoutUser();
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// Logout from Google
export const googleLogout = () => {
  // Clear local storage
  localStorage.removeItem('token');
  
  // If using @react-oauth/google
  if (window.google) {
    window.google.accounts.id.revoke();
  }
  
  // Redirect to login
  window.location.href = '/login';
};
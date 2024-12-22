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


// Logout user
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  window.location.href = '/login';
};

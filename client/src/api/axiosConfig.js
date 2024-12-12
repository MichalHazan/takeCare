import axios from "axios";
import { refreshToken, logoutUser } from "../utils/authUtils";
// Determine the base URL based on the environment
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://production-server.com"
    : "http://localhost:2000");

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,

  // Enable sending cookies cross-origin if needed
  withCredentials: true,

  // Default timeout for requests
  timeout: 10000,

  // Default headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        // Update the Authorization header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token is also invalid, logout the user
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;

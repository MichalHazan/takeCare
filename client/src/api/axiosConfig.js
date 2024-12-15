import axios from "axios";

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
    "Content-Type": "application/json",
    // You can add other default headers here
  },
});

// Request interceptor - run before every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - run after every response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - maybe redirect to login or refresh token
          console.log("Unauthorized access");
          break;
        case 403:
          // Forbidden
          console.log("Access forbidden");
          break;
        case 404:
          // Not found
          console.log("Resource not found");
          break;
        case 500:
          // Server error
          console.log("Server error");
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
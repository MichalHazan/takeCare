import React, { useEffect, useState } from "react";
import { checkLogin, getLoggedInUser } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login first
    if (!checkLogin()) {
      navigate("/login");
      return;
    }

    // Get logged-in user
    const loggedInUser = getLoggedInUser();
    
    if (loggedInUser) {
      // Check user role
      if (loggedInUser.role !== "admin") {
        setError("Access denied. You do not have the right permissions.");
      }
      
      // Set user state
      setUser(loggedInUser);
    } else {
      // No user found
      navigate("/login");
    }

    // Set loading to false
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome, Admin</h1>
      {/*  admin content goes here */}
    </div>
  );
};

export default AdminPage;
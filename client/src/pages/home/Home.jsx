import { Box, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../utils/authUtils";
import Map from "../home/Map"
import Filters from "./Filters";
import Users from "./Users";


const Home = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // משיכת נתונים מה-API
    fetch("http://localhost:2000/api/users/allprofessional")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data); // שמירת כל היוזרים
        setFilteredUsers(data); // ברירת המחדל: כל היוזרים
        data.map((id) => {console.log(id
        )})
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    
    <Box sx={{ display: "flex", justifyContent:"space-between", height: "200%", height: "93vh"}}>
     
      <Filters users={users} setFilteredUsers={setFilteredUsers} />
      <Users filteredUsers={filteredUsers} />
      <Map users={users} ></Map>
    </Box>
  );
};

export default Home;
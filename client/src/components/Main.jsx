import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminPage from "../pages/Admin";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Feed from "./feed/Feed";
import MyAcount from "./test/myAcount";
import IsraeliAddressSelector from "./test/IsraeliAddressSelector";

export default function Main() {
  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/Feed" element={<Feed />}></Route>
        <Route path="/admin" element={<AdminPage />}></Route>
        <Route path="/test" element={<MyAcount />}></Route>
        <Route path="/testCities" element={<IsraeliAddressSelector />}></Route>
      </Routes>
    </div>
  );
}

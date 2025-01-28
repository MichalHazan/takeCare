import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminPage from "../pages/Admin";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Feed from "./feed/Feed";
import CreateAccountForm from "./CreateAccount/CreateAccountForm";

export default function Main() {
  return (
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/Feed" element={<Feed />} />
          <Route path="/Feed/:userId" element={<Feed />}></Route>
          <Route path="/admin" element={<AdminPage />}></Route>
          <Route path="/register" element={<CreateAccountForm />}></Route>
        </Routes>
      </div>
  );
}
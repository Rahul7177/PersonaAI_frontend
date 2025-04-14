import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../stylesheets/MyAccount.css";

const MyAccount = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const user = auth?.user; // ✅ Safely get user from auth

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="my-account-container">
      <h2>My Account</h2>
      <div className="account-card">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>

        <button className="cta-button">Reset Password</button>
        <button className="cta-button">Manage My Data</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default MyAccount;

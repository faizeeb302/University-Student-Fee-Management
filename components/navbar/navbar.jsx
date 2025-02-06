"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn"); // Remove session storage
    router.push("/"); // Redirect to login page
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Admin Dashboard</h1>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    height: "60px",
    backgroundColor: "#007bff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Added to align items properly
    padding: "0 20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;

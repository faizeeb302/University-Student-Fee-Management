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
      <div style={styles.logoContainer}>
      <h1 style={styles.logo}>Quaid-e-Awam University of Engineering, Sciences and Technology Nawabshah</h1>
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
    </nav>
  );
};

const styles = {
  navbar: {
    height: "90px",
    backgroundColor: "#022b56ff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Added to align items properly
    padding: "0 20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
display: "flex",
    width: "90%",
    justifyContent: "center",
  },
  logo: {
    fontSize: "1.75rem",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#fcfbfbff",
    color: "#fff",
    border: "none",
    padding: "6px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    borderRadius: "4px",
    color: "#022b56ff"
  },
};

export default Navbar;

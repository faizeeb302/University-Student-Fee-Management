// components/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Admin Dashboard</h1>
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
    padding: "0 20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default Navbar;

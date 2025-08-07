"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import imagePath from "../../public/University_logo.png"

const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = [
    { label: "Add", route: "/add" },
    { label: "View", route: "/list" },
    { label: "Update", route: "/update" },
    { label: "Update/View Suspended", route: "/update-view-suspended" },
    { label: "Fees Entry", route: "/fees" },
    { label: "Yearly Fees System", route: "/yearly-fee" },
    { label: "Fees Detail", route: "/fee-details" },
    { label: "View Results", route: "/view-results" },
    { label: "Update Result", route: "/update-results" },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoBox}>
        <Image
          src={imagePath}
          alt="University Logo"
          width={180}
          height={60}
        />
        <div style={styles.logoTextLarge}>QUEST</div>
        <div style={styles.logoTextSmall}>Nawabshah</div>
      </div>

      <h2 style={styles.title}>Student Panel</h2>

      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        const isHovered = hoveredTab === tab.route;

        return (
          <Link key={tab.route} href={tab.route} legacyBehavior>
            <a
              style={{
                ...styles.tab,
                backgroundColor: isActive
                  ? "#ecfab5"
                  : isHovered
                  ? "#e8efc8ff"
                  : "#fff",
                fontWeight: isActive ? "600" : "normal",
                color: isActive ? "#0d1725ff" : "#333",
              }}
              onMouseEnter={() => setHoveredTab(tab.route)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {tab.label}
            </a>
          </Link>
        );
      })}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "auto",
    backgroundColor: "#e7e8e9ff",
    borderRight: "1px solid #ddd",
    padding: "20px 10px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
  },
  logoBox: {
    width: "100%",
    height: "260px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    marginBottom: "15px",
  },
  logoTextLarge: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "8px",
    color: "#0d1725ff",
  },
  logoTextSmall: {
    fontSize: "0.8",
    color: "#666",
    marginTop: "2px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
    // paddingLeft: "5px",
    margin: "1rem auto"
  },
  tab: {
    width: "100%",
    padding: "10px 15px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "block",
    transition: "background-color 0.3s, color 0.3s",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Sidebar;

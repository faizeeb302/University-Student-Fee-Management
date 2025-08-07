"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = [
    { label: "Add", route: "/add" },
    { label: "View", route: "/list" },
    { label: "Update", route: "/update" },
    // { label: "Delete Student", route: "/delete-student" },
    { label: "Update/View Suspended", route: "/update-view-suspended" },
    { label: "Fee Entry", route: "/fees" },
    { label: "Yearly Fee System", route: "/yearly-fee" },
    { label: "Fee Details", route: "/fee-details" },
     { label: "View Results", route: "/view-results" },
        { label: "Update Result", route: "/update-result" },
  ];

  return (
    <div style={styles.sidebar}>
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
    height: "100vh",
    backgroundColor: "#e7e8e9ff",
    borderRight: "1px solid #ddd",
    padding: "20px 10px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
    paddingLeft: "5px",
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

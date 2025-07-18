"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = [
    { label: "Add Student", route: "/add-student" },
    { label: "View List", route: "/view-list" },
    { label: "Update Student", route: "/update-student" },
    // { label: "Delete Student", route: "/delete-student" },
    { label: "Suspend Student", route: "/add-suspension" },
    { label: "Fee Submission", route: "/fee-submission" },
    { label: "Fee Details", route: "/fee-details" },
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
                  ? "#cfe2ff"
                  : isHovered
                  ? "#f0f4ff"
                  : "#fff",
                fontWeight: isActive ? "600" : "normal",
                color: isActive ? "#084298" : "#333",
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
    backgroundColor: "#f8f9fa",
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

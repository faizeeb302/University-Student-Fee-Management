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
    { label: "Delete Student", route: "/delete-student" },
  ];

  return (
    <div style={styles.sidebar}>
      {tabs.map((tab) => (
        <div
          key={tab?.route}
          style={{
            ...styles.tab,
            backgroundColor:
              pathname === tab?.route
                ? "#a9c7ff"
                : hoveredTab === tab.route
                ? "#e8f1ff"
                : "#fff",
          }}
          onMouseEnter={() => setHoveredTab(tab.route)}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link href={tab?.route}>{tab.label}</Link>
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #ddd",
    padding: "10px",
    boxSizing: "border-box",
  },
  tab: {
    padding: "10px 15px",
    margin: "5px 0",
    cursor: "pointer",
    borderRadius: "4px",
    textAlign: "left",
    fontSize: "16px",
    transition: "background-color 0.3s ease", // Smooth hover transition
  },
};

export default Sidebar;

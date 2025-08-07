"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoMdAdd, IoMdCreate, IoMdTrash } from "react-icons/io";

const UpdateResult = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [semesterResults, setSemesterResults] = useState(Array.from({ length: 8 }, () => []));
  const [newResult, setNewResult] = useState({ subject: "", status: "" });
  const [activeSemester, setActiveSemester] = useState("1");

  const handleAddResult = () => {
    const index = parseInt(activeSemester) - 1;
    const updated = [...semesterResults];
    updated[index].push(newResult);
    setSemesterResults(updated);
    setNewResult({ subject: "", status: "" });
  };

  const handleUpdateResult = (semesterIndex, resultIndex, updatedResult) => {
    const updated = [...semesterResults];
    updated[semesterIndex][resultIndex] = updatedResult;
    setSemesterResults(updated);
  };

  const handleDeleteResult = (semesterIndex, resultIndex) => {
    const updated = [...semesterResults];
    updated[semesterIndex].splice(resultIndex, 1);
    setSemesterResults(updated);
  };

  const handleSave = () => {
    Swal.fire("Saved!", "Results have been saved.", "success");
    console.log("Saving results:", { rollNumber, semesterResults });
  };

  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Update Student Results</h1>
      <h3 style={styles.subHeading}>Semester-wise Status Entry (Pass/Fail)</h3>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Roll Number</label>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Enter Roll Number"
          style={styles.input}
        />
      </div>

      <div style={styles.tabHeader}>
        {semesters.map((sem) => (
          <button
            key={sem}
            onClick={() => setActiveSemester(sem)}
            style={activeSemester === sem ? styles.activeTab : styles.tab}
          >
            Sem {sem}
          </button>
        ))}
      </div>

      <div style={styles.resultList}>
        {semesterResults[parseInt(activeSemester) - 1].map((result, index) => (
          <div key={index} style={styles.resultItem}>
            <span>{result.subject}: {result.status}</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <IoMdCreate
                style={styles.icon}
                onClick={() => {
                  Swal.fire({
                    title: "Edit Result",
                    html: `
                      <input id="sub" class="swal2-input" placeholder="Subject" value="${result.subject}"/>
                      <select id="status" class="swal2-input">
                        <option value="Pass" ${result.status === "Pass" ? "selected" : ""}>Pass</option>
                        <option value="Fail" ${result.status === "Fail" ? "selected" : ""}>Fail</option>
                      </select>
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                      const sub = document.getElementById("sub").value;
                      const status = document.getElementById("status").value;
                      if (!sub || !status) {
                        Swal.showValidationMessage("Both fields are required");
                        return;
                      }
                      handleUpdateResult(parseInt(activeSemester) - 1, index, { subject: sub, status });
                    },
                  });
                }}
              />
              <IoMdTrash
                style={{ ...styles.icon, color: "#dc3545" }}
                onClick={() => handleDeleteResult(parseInt(activeSemester) - 1, index)}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            value={newResult.subject}
            onChange={(e) => setNewResult({ ...newResult, subject: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Status</label>
          <select
            value={newResult.status}
            onChange={(e) => setNewResult({ ...newResult, status: e.target.value })}
            style={styles.input}
          >
            <option value="">Select Status</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
        <button style={styles.addButton} onClick={handleAddResult}>
          <IoMdAdd /> Add Result
        </button>
      </div>

      <button onClick={handleSave} style={styles.saveButton}>Save All Results</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  subHeading: {
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "500",
    marginBottom: "30px",
    color: "#555",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  tabHeader: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px",
  },
  tab: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
  },
  activeTab: {
    padding: "8px 12px",
    border: "2px solid #007bff",
    borderRadius: "4px",
    background: "#e7f1ff",
    cursor: "pointer",
  },
  resultList: {
    marginBottom: "20px",
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  icon: {
    fontSize: "1.2rem",
    color: "#007bff",
    cursor: "pointer",
  },
  row: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "20px",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 16px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  saveButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px 24px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
};

export default UpdateResult;

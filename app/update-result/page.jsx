"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoWarningOutline } from "react-icons/io5";
import ClientOnlySelect from "../../components/CustomSelect/clientOnlySelect";

const UpdateResult = () => {
  const [semester, setSemester] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [rollNumberError, setRollNumberError] = useState("");
  const [results, setResults] = useState([]);
  const [newResult, setNewResult] = useState({ subject: "", status: "" });

  const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Semester ${i + 1}`,
  }));

  const statusOptions = [
    { value: "Pass", label: "Pass" },
    { value: "Fail", label: "Fail" },
  ];

  const handleAddResult = () => {
    if (!newResult.subject || !newResult.status) {
      Swal.fire("Incomplete Entry", "Both subject and status are required.", "warning");
      return;
    }
    setResults((prev) => [...prev, newResult]);
    setNewResult({ subject: "", status: "" });
  };

  const handleUpdateResult = (index, updatedResult) => {
    const updated = [...results];
    updated[index] = updatedResult;
    setResults(updated);
  };

  const handleDeleteResult = (index) => {
    const updated = [...results];
    updated.splice(index, 1);
    setResults(updated);
  };

  const handleRollChange = (e) => {
    const value = e.target.value;
    const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
    setRollNumber(value);
    if (value && !rollRegex.test(value)) {
      setRollNumberError("Roll number must be in format: 21-BSCS-38");
    } else {
      setRollNumberError("");
    }
  };

 const handleSave = async () => {
  console.log("semester, rollNumber, results.length",semester, rollNumber, results.length)
  if (!semester || !rollNumber || results.length === 0) {
    Swal.fire("Missing Information", "Semester, roll number, and at least one subject are required.", "warning");
    return;
  }

  const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
  if (!rollRegex.test(rollNumber)) {
    Swal.fire("Invalid Roll Number", "Roll number must be in format: 21-BSCS-38", "warning");
    return;
  }

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update this result?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!confirm.isConfirmed) return;

  try {
    for (const result of results) {
      const response = await fetch("/api/update-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: rollNumber,
          semester: parseInt(semester),
          subjectName: result.subject,
          status: result.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update a subject result");
      }
    }

    Swal.fire("Success", "All subject results updated successfully.", "success");

    // Reset form
    setSemester("");
    setRollNumber("");
    setResults([]);
    setNewResult({ subject: "", status: "" });
    setRollNumberError("");
  } catch (error) {
    console.error("Error updating results:", error);
    Swal.fire("Error", error.message, "error");
  }
};



  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Update Results</h2>

      <div style={styles.formSection}>
        <label style={styles.label}>Semester</label>
        <ClientOnlySelect
          options={semesterOptions}
          placeholder="Select Semester"
          value={semesterOptions.find((s) => s.value === semester) || null}
          onChange={(selected) => setSemester(selected?.value || "")}
          styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
        />

        <label style={styles.label}>Student Roll Number</label>
        <input
          type="text"
          value={rollNumber}
          onChange={handleRollChange}
          placeholder="e.g., 21-BSCS-38"
          style={styles.input}
        />
        {rollNumberError && (
          <div style={styles.warning}>
            <IoWarningOutline style={{ color: "#d9534f", fontSize: "1.2rem" }} />
            <span>{rollNumberError}</span>
          </div>
        )}

        <label style={styles.label}>Subjects</label>
        {results.map((result, index) => (
          <div key={index} style={styles.subjectGroup}>
            <input
              type="text"
              value={result.subject}
              readOnly
              style={{ ...styles.input, marginBottom: "4px" }}
            />
            <input
              type="text"
              value={result.status}
              readOnly
              style={styles.input}
            />
            <button onClick={() => handleDeleteResult(index)} style={styles.deleteButton}>×</button>
          </div>
        ))}

        <div style={styles.subjectGroup}>
          <input
            type="text"
            value={newResult.subject}
            onChange={(e) => setNewResult({ ...newResult, subject: e.target.value })}
            placeholder="Subject"
            style={styles.input}
          />
          <div style={{ flex: 1 }}>
            <ClientOnlySelect
              options={statusOptions}
              placeholder="Select Status"
              value={statusOptions.find((s) => s.value === newResult.status) || null}
              onChange={(selected) => setNewResult({ ...newResult, status: selected?.value || "" })}
              styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
            />
          </div>
          <button onClick={handleAddResult} style={styles.addButton}>+</button>
        </div>

        <button onClick={handleSave} style={styles.saveButton}>Confirm</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "4rem auto",
    padding: "40px 20px",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.25rem",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#333",
  },
  breadcrumb: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "20px",
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontWeight: "bold",
    marginTop: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "60%",
    boxSizing: "border-box",
  },
  subjectGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 16px",
    fontSize: "18px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "16px",
    cursor: "pointer",
  },
  saveButton: {
    marginTop: "20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  warning: {
    color: "#d9534f",
    marginTop: "5px",
    fontSize: "0.9rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default UpdateResult;
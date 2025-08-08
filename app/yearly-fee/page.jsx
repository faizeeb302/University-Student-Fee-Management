"use client";
import React, { useState } from "react";
import ClientOnlySelect from "../../components/CustomSelect/clientOnlySelect"; // adjust path if needed
 import Swal from "sweetalert2";

const YearlyFee = () => {
  const startYear = 2000;
  const endYear = 2050;
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const y = (startYear + i).toString();
    return { label: y, value: y };
  });

  
const semesterLabels = ["Odd Semester", "Even Semester"];
  const [year, setYear] = useState({ label: "2025", value: "2025" });
  const [fees, setFees] = useState(
    semesterLabels.map(() => ({ fee: "", dueDate: "", isEditing: false }))
  );

  const handleEditToggle = (index) => {
    const updated = [...fees];
    updated[index].isEditing = !updated[index].isEditing;
    setFees(updated);
  };

  const handleFeeChange = (index, value) => {
    const updated = [...fees];
    updated[index].fee = value;
    setFees(updated);
  };

  const handleDateChange = (index, value) => {
    const updated = [...fees];
    updated[index].dueDate = value;
    setFees(updated);
  };



const handleConfirm = async (index) => {
  const semesterType = index === 0 ? "Odd" : "Even";
  const feeAmount = fees[index].fee;
  const dueDate = fees[index].dueDate;
  const selectedYear = year.value;

  if (!feeAmount || !dueDate) {
    Swal.fire("Missing Fields", "Please enter both fee and due date.", "warning");
    return;
  }

  const confirm = await Swal.fire({
    title: `Confirm ${semesterType} Semester Fee`,
    html: `
      <div style="text-align:left">
        <p><strong>Year:</strong> ${selectedYear}</p>
        <p><strong>Semester Type:</strong> ${semesterType}</p>
        <p><strong>Fee Amount:</strong> Rs. ${feeAmount}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    const response = await fetch("/api/yearly-fee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: selectedYear,
        semesterType,
        feeAmount,
        dueDate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save yearly fee");
    }

    Swal.fire("Success", `Yearly ${semesterType} semester fee saved!`, "success");

    const updated = [...fees];
    updated[index].isEditing = false;
    setFees(updated);
  } catch (error) {
    console.error("API Error:", error);
    Swal.fire("Error", error.message, "error");
  }
};


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Yearly Fee Setup</h2>

      <div style={styles.section}>
        <label htmlFor="year" style={styles.label}>
          Select Academic Year
        </label>
        <ClientOnlySelect
          options={yearOptions}
          value={year}
          onChange={(selected) => setYear(selected)}
          placeholder="Select Year"
          isSearchable
          styles={{ control: (base) => ({ ...base, minHeight: "42px", fontSize: "15px" }) }}
        />
      </div>

      {semesterLabels.map((label, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.row}>
            <div style={styles.labelText}>{label}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.labelText}>Semester Fee</div>
            <input
              type="number"
              value={fees[index].fee}
              onChange={(e) => handleFeeChange(index, e.target.value)}
              disabled={!fees[index].isEditing}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.labelText}>Due Date</div>
            <input
              type="date"
              value={fees[index].dueDate}
              onChange={(e) => handleDateChange(index, e.target.value)}
              disabled={!fees[index].isEditing}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => handleEditToggle(index)}
              style={{ ...styles.button, ...styles.editButton }}
            >
              {fees[index].isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={() => handleConfirm(index)}
              disabled={!fees[index].isEditing}
              style={{
                ...styles.button,
                ...(fees[index].isEditing
                  ? styles.confirmButtonActive
                  : styles.confirmButtonDisabled),
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "720px",
    margin: "40px auto",
    padding: "32px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "24px",
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: "28px",
  },
  label: {
    display: "block",
    fontWeight: "500",
    marginBottom: "6px",
    fontSize: "15px",
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "15px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
    marginBottom: "14px",
  },
  labelText: {
    fontWeight: "600",
    minWidth: "120px",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "background 0.3s ease",
  },
  editButton: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ccc",
  },
  confirmButtonActive: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "1px solid #007bff",
  },
  confirmButtonDisabled: {
    backgroundColor: "#e0e0e0",
    color: "#888",
    cursor: "not-allowed",
  },
};

export default YearlyFee;

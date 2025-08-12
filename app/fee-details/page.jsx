"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner/spinner";

const FeeDetails = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState(null);

  const fetchFeeDetails = async () => {
    if (!rollNumber.trim()) {
      Swal.fire("Missing Roll Number", "Please enter a valid roll number.", "warning");
      return;
    }

    setLoading(true);
    setFeeDetails([]);
    setStudentName(null);

    try {
      const res = await fetch(`/api/get-fee?rollNumber=${encodeURIComponent(rollNumber.trim())}`);
      const data = await res.json().catch(() => ({}));

      // If no records or 404
      if (res.status === 404 || !data?.fees || data.fees.length === 0) {
        Swal.fire("No Records", "No fee records found with this roll number.", "info");
        return;
      }

      if (!res.ok) {
        Swal.fire("Error", data?.message || "Failed to fetch fee data.", "error");
        return;
      }

      // Map to required fields
      const rows = data.fees.map((f) => ({
        semesterType: f.semesterType,
        semesterYear: f.semesterYear,
        amount: f.amount,
        submissionDate: f.submissionDate || "-",
        challanId: f.challanId || "-",
      }));

      // Sort by year and type
      rows.sort((a, b) => {
        const yearDiff = Number(b.semesterYear) - Number(a.semesterYear);
        if (yearDiff !== 0) return yearDiff;
        const order = (t) => (t?.toLowerCase() === "spring" ? 0 : 1);
        return order(a.semesterType) - order(b.semesterType);
      });

      setFeeDetails(rows);
      setStudentName(data?.studentName || rollNumber.trim());
    } catch (err) {
      console.error("Error fetching fee details:", err);
      Swal.fire("Error", "Failed to fetch fee data. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Fee Details</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchFeeDetails} style={styles.button}>Fetch</button>
      </div>

      {loading ? (
        <Spinner />
      ) : feeDetails.length > 0 ? (
        <div>
          <h3 style={styles.studentName}>
            Roll Number: <span style={{ color: "#007bff" }}>{studentName}</span>
          </h3>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Semester Type</th>
                  <th style={styles.th}>Semester Year</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Submission Date</th>
                  <th style={styles.th}>Challan ID</th>
                </tr>
              </thead>
              <tbody>
                {feeDetails.map((fee, idx) => (
                  <tr
                    key={`${fee.semesterType}-${fee.semesterYear}-${idx}`}
                    style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                  >
                    <td style={styles.td}>{fee.semesterType}</td>
                    <td style={styles.td}>{fee.semesterYear}</td>
                    <td style={styles.td}>Rs. {fee.amount}</td>
                    <td style={styles.td}>{fee.submissionDate}</td>
                    <td style={styles.td}>{fee.challanId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fbfd",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: "#333",
  },
  studentName: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "15px",
  },
  inputContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    flex: 1,
    minWidth: "240px",
    fontSize: "16px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e1e4e8",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
    backgroundColor: "white",
    textAlign: "center",
  },
  tableRowEven: {
    backgroundColor: "#f5f8fa",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  th: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "14px",
    textAlign: "center",
    fontSize: "15px",
    border: "1px solid #e1e4e8",
  },
  td: {
    padding: "14px",
    border: "1px solid #e1e4e8",
    textAlign: "center",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },
};

export default FeeDetails;

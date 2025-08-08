"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner/spinner";

const FeeDetails = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState(null);

//   const fetchFeeDetails = async () => {
//     if (!rollNumber.trim()) {
//       Swal.fire("Please enter a valid roll number.");
//       return;
//     }

//     setLoading(true);
//     setFeeDetails([]);
//     try {
//       const response = await fetch(`/api/get-fee-details?roll=${rollNumber}`);
//       const data = await response.json();

//       if (!data || data.length === 0) {
//         Swal.fire("No fee details found for the given roll number.");
//       } else {
//         setFeeDetails(data.semesters);
//         setStudentName(data.name);
//       }
//     } catch (error) {
//       console.error("Error fetching fee details:", error);
//       Swal.fire("Error fetching fee details. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

const fetchFeeDetails = async () => {
  if (!rollNumber.trim()) {
    Swal.fire("Missing Roll Number", "Please enter a valid roll number.", "warning");
    return;
  }

  setLoading(true);
  setFeeDetails([]);
  setStudentName(null);

  try {
    const response = await fetch(`/api/get-fee?rollNumber=${rollNumber}`);
    const data = await response.json();

    if (!response.ok) {
      Swal.fire("Error", data.message || "Failed to fetch fee data.");
      return;
    }

    // All semesters (1 to 8)
    const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

    // Map semesters to fee records (if found)
    const mappedFees = semesters.map((sem) => {
      const feeRecord = data.fees.find((f) => Number(f.semester) === sem);

      if (feeRecord) {
        return {
          semester: sem,
          paid: true,
          amount: feeRecord.amount,
          date: feeRecord.submissionDate,
          challanId: feeRecord.challanId,
        };
      } else {
        return {
          semester: sem,
          paid: false,
        };
      }
    });

    setFeeDetails(mappedFees);
    setStudentName(rollNumber); // or fetch from another API if needed
  } catch (error) {
    console.error("Error fetching fee details:", error);
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
          <h3 style={styles.studentName}>Roll Number: <span style={{ color: '#007bff' }}>{studentName}</span></h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Amount Paid</th>
                  <th style={styles.th}>Remaining</th>
                  <th style={styles.th}>Date Paid</th>
                  <th style={styles.th}>Challan ID</th>
                </tr>
              </thead>
              <tbody>
                {feeDetails.map((fee, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                    <td style={styles.td}>{fee.semester}</td>
                    <td style={{ ...styles.td, color: fee.paid ? "green" : "red", fontWeight: "bold" }}>
                      {fee.paid ? "Paid" : "Not Paid"}
                    </td>
                    <td style={styles.td}>{fee.paid ? `Rs. ${fee.amount}` : "-"}</td>
                    <td style={styles.td}>{fee.paid ? `Rs. ${fee.remaining ?? 0}` : "Rs. 15000"}</td>
                    <td style={styles.td}>{fee.paid ? fee.date : "-"}</td>
                    <td style={styles.td}>{fee.paid ? fee.challanId : "-"}</td>
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
    fontWeight: "600",
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

"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner/spinner";

const FeeSubmission = () => {
  const [feeData, setFeeData] = useState({
    studentId: "",
    semester: "",
    challanId: "",
    amount: "",
  });

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const { studentId, semester, challanId, amount } = feeData;

    if (!studentId || !semester || !challanId || !amount) {
      Swal.fire("Missing Fields", "Please fill in all fields.", "warning");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Swal.fire("Invalid Amount", "Fee amount must be a positive number.", "error");
      return;
    }

    setLoading(true);

    try {
      // TODO: Submit data to backend API here
      // await fetch('/api/submit-fee', { method: 'POST', body: JSON.stringify(feeData) })

      setSubmissions((prev) => [...prev, feeData]);
      Swal.fire("Success", "Fee submitted successfully!", "success");

      setFeeData({
        studentId: "",
        semester: "",
        challanId: "",
        amount: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire("Error", "Something went wrong while submitting.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fee Submission</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Student ID"
          value={feeData.studentId}
          onChange={(e) => handleChange("studentId", e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Semester"
          value={feeData.semester}
          onChange={(e) => handleChange("semester", e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Challan ID"
          value={feeData.challanId}
          onChange={(e) => handleChange("challanId", e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Fee Amount"
          value={feeData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit Fee
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div style={{ marginTop: "30px" }}>
          <h2>Submitted Fees</h2>
          {submissions.length > 0 ? (
            submissions.map((fee, index) => (
              <div key={index} style={styles.card}>
                <p><strong>Student ID:</strong> {fee.studentId}</p>
                <p><strong>Semester:</strong> {fee.semester}</p>
                <p><strong>Challan ID:</strong> {fee.challanId}</p>
                <p><strong>Amount:</strong> Rs. {fee.amount}</p>
              </div>
            ))
          ) : (
            <p>No fee submissions yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "10px",
  },
};

export default FeeSubmission;

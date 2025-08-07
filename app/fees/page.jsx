"use client";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { IoWarningOutline } from "react-icons/io5";
import Spinner from "../../components/Spinner/spinner";

const FeeSubmission = () => {
  const [feeData, setFeeData] = useState({
    rollNumber: "",
    semester: "",
    challanId: "",
    amount: "",
    submissionDate: "",
    challanImage: null,
    challanImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [rollNumberError, setRollNumberError] = useState("");
  const printRef = useRef();

  const handleChange = (field, value) => {
    if (field === "rollNumber") {
      const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
      if (value && !rollRegex.test(value)) {
        setRollNumberError("Roll number must be in format: 21-BSCS-38");
      } else {
        setRollNumberError("");
      }
    }

      if (field === "challanId") {
    value = value.replace(/\D/g, "");
  }

    setFeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > (1001 * 1024)) {
        Swal.fire("Image Too Large", "Challan image must be less than 1MB.", "error");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFeeData((prev) => ({
        ...prev,
        challanImage: file,
        challanImageUrl: imageUrl,
      }));
    }
  };

 const handleSubmit = async () => {
  const { rollNumber, semester, challanId, amount, submissionDate, challanImageUrl } = feeData;

  const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
  if (!rollNumber || !semester || !challanId || !amount || !submissionDate || !feeData.challanImage) {
    Swal.fire("Missing Fields", "Please fill in all fields and upload the challan image.", "warning");
    return;
  }

  if (!rollRegex.test(rollNumber)) {
    Swal.fire("Invalid Roll Number", "Roll number must be in format: 21-BSCS-38", "error");
    return;
  }

  if (isNaN(semester) || Number(semester) < 1 || Number(semester) > 8) {
    Swal.fire("Invalid Semester", "Semester must be between 1 and 8.", "error");
    return;
  }

  if (isNaN(amount) || Number(amount) <= 0) {
    Swal.fire("Invalid Amount", "Fee amount must be a positive number.", "error");
    return;
  }

  setLoading(true);

  try {
    const result = await Swal.fire({
      title: "Fee Submission Summary",
      html: `
        <div style="text-align:left; font-size: 0.95rem">
          <p><strong>Roll Number:</strong> ${rollNumber}</p>
          <p><strong>Semester:</strong> ${semester}</p>
          <p><strong>Challan ID:</strong> ${challanId}</p>
          <p><strong>Amount:</strong> Rs. ${amount}</p>
          <p><strong>Date:</strong> ${submissionDate}</p>
          ${
            challanImageUrl
              ? `<img src="${challanImageUrl}" alt="Challan" style="width:120px;margin-top:10px;border-radius:6px;border:1px solid #ccc" />`
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      Swal.fire("Cancelled", "Submission was cancelled.", "info");
      return;
    }

    // ✅ Submit to backend API
    const response = await fetch("/api/fee-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rollNumber,
        semester: Number(semester),
        challanId,
        amount: Number(amount),
        submissionDate,
        challanImageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    Swal.fire("Success", "Fee submitted successfully!", "success");

    // Reset form
    setFeeData({
      rollNumber: "",
      semester: "",
      challanId: "",
      amount: "",
      submissionDate: "",
      challanImage: null,
      challanImageUrl: "",
    });
    setRollNumberError("");
  } catch (error) {
    console.error("Submission error:", error);
    Swal.fire("Error", error.message || "Failed to submit fee", "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Fee Submission</h1>

      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Roll Number</label>
          <input
            type="text"
            value={feeData.rollNumber}
            onChange={(e) => handleChange("rollNumber", e.target.value)}
            style={styles.input}
          />
          {rollNumberError && (
            <div style={styles.warning}>
              <IoWarningOutline style={{ color: "#d9534f", fontSize: "1.2rem" }} />
              <span>{rollNumberError} <span style={styles.example}>(e.g., 21-BSCS-38)</span></span>
            </div>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Semester (1–8)</label>
          <input
            type="number"
            value={feeData.semester}
            min="1"
            max="8"
            onChange={(e) => handleChange("semester", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Challan ID</label>
          <input
            type="text"
            value={feeData.challanId}
            onChange={(e) => handleChange("challanId", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Fee Amount</label>
          <input
            type="number"
            value={feeData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Submission Date</label>
          <input
            type="date"
            value={feeData.submissionDate}
            onChange={(e) => handleChange("submissionDate", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Upload Challan Image (less than 1MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
        </div>

        {feeData.challanImageUrl && (
          <img
            src={feeData.challanImageUrl}
            alt="Challan Preview"
            style={styles.imagePreview}
          />
        )}

        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit Fee
        </button>
      </div>

      {loading && <Spinner />}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.75rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
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
  example: {
    fontStyle: "italic",
    fontWeight: "400",
    marginLeft: "4px",
    color: "#a94442",
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "6px",
    marginTop: "10px",
  },
};

export default FeeSubmission;

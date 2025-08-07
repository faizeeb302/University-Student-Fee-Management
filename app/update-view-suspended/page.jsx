"use client";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner/spinner";

const ViewList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspensionStates, setSuspensionStates] = useState({});

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-students");
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchStudent = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      fetchAllStudents();
      return;
    }
    console.log("trimmed",trimmed)

    setLoading(true);
    try {
       const response = await fetch("/api/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rollNumber: trimmed
          }),
        });
      const data = await response.json();

      if (response.ok && data) {
        setStudents([data]);
        setFilteredStudents([data]);
      } else {
        setStudents([]);
        setFilteredStudents([]);
        Swal.fire("Not Found", "No student found with that roll number.", "info");
      }
    } catch (error) {
      console.error("Search error:", error);
      Swal.fire("Error", "Failed to fetch student.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleSuspension = (index) => {
    setSuspensionStates((prev) => ({
      ...prev,
      [index]: {
        show: !prev[index]?.show,
        fromDate: "",
        toDate: "",
        reason: "",
      },
    }));
  };

  const handleSuspensionChange = (index, field, value) => {
    setSuspensionStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const confirmSuspension = async (student, index) => {
    const { fromDate, toDate, reason } = suspensionStates[index] || {};

    if (!fromDate || !toDate || !reason.trim()) {
      Swal.fire("Missing Fields", "Please fill all suspension details.", "warning");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      Swal.fire("Invalid Range", "`From` date must be before `To` date.", "error");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Confirm Suspension",
      html: `
        Are you sure you want to suspend <strong>${student.rollNumber}</strong> 
        from <strong>${fromDate}</strong> to <strong>${toDate}</strong> for reason:
        <br/><em>${reason}</em>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Suspend",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch("/api/suspend-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rollNumber: student.rollNumber,
            fromDate,
            toDate,
            reason,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire("Suspended!", `${student.rollNumber} has been suspended.`, "success");

          setSuspensionStates((prev) => ({
            ...prev,
            [index]: { show: false, fromDate: "", toDate: "", reason: "" },
          }));

          setStudents((prev) =>
            prev.map((s) =>
              s.rollNumber === student.rollNumber ? { ...s, isSuspended: true } : s
            )
          );
        } else {
          Swal.fire("Error", result.message || "Failed to suspend student.", "error");
        }
      } catch (error) {
        console.error("Suspension error:", error);
        Swal.fire("Error", "An unexpected error occurred.", "error");
      }
    }
  };

  const removeSuspension = (student) => {
    Swal.fire({
      title: "Remove Suspension",
      text: `Are you sure you want to remove suspension for ${student.rollNumber}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Call API to remove suspension
        Swal.fire("Removed!", `${student.rollNumber}'s suspension has been removed.`, "success");
      }
    });
  };

 const showStudentDetails = async (student) => {
  try {
    const res = await fetch(`/api/suspension-data?rollNumber=${encodeURIComponent(student.rollNumber)}`);
    const suspensions = await res.json();

    Swal.fire({
      title: `<strong>Suspension History</strong>`,
      html: `
        <div style="text-align: left;">
          <p><strong>Name:</strong> ${student.firstName}</p>
          <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
          <p><strong>Department:</strong> ${student.department}</p>
          <hr />
          ${
            Array.isArray(suspensions) && suspensions.length > 0
              ? `
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ccc; padding: 8px;">From</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">To</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  ${suspensions
                    .map(
                      (s) => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">${s.fromDate}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${s.toDate}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${s.reason}</td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            `
              : `<p>No suspension history available.</p>`
          }
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
      width: 700,
    });
  } catch (error) {
    console.error("Failed to fetch suspension history:", error);
    Swal.fire("Error", "Could not load suspension history.", "error");
  }
};


  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={styles.title}>Student List</h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Roll Number (e.g., 21-BSCS-38)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />
        <button onClick={searchStudent} style={styles.searchButton}>Search</button>
      </div>

      {loading ? (
        <Spinner />
      ) : filteredStudents.length > 0 ? (
        filteredStudents.map((student, index) => {
          const suspension = suspensionStates[index] || {};
          return (
            <div key={index} style={styles.card}>
              <div style={styles.imageContainer}>
                <img
                  src={student.image || "/default-avatar.png"}
                  alt="Student"
                  style={styles.image}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                <p><strong>Department:</strong> {student.department}</p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  <button onClick={() => toggleSuspension(index)} style={styles.suspendButton}>
                    {suspension.show ? "Hide Suspension" : "Suspend"}
                  </button>
                </div>

                {suspension.show && (
                  <div style={styles.suspensionForm}>
                    <label>
                      From:
                      <input
                        type="date"
                        value={suspension.fromDate}
                        onChange={(e) =>
                          handleSuspensionChange(index, "fromDate", e.target.value)
                        }
                        style={styles.dateInput}
                      />
                    </label>
                    <label>
                      To:
                      <input
                        type="date"
                        value={suspension.toDate}
                        onChange={(e) =>
                          handleSuspensionChange(index, "toDate", e.target.value)
                        }
                        style={styles.dateInput}
                      />
                    </label>
                    <label style={{ flex: "1 1 100%" }}>
                      Reason:
                      <textarea
                        value={suspension.reason}
                        onChange={(e) => handleSuspensionChange(index, "reason", e.target.value)}
                        style={styles.reasonInput}
                        rows={2}
                        placeholder="Enter reason for suspension"
                      />
                    </label>
                    <button
                      onClick={() => confirmSuspension(student, index)}
                      style={styles.confirmButton}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
              <FaEye
                style={styles.eyeIcon}
                className="eye-icon"
                onClick={() => showStudentDetails(student)}
              />
            </div>
          );
        })
      ) : (
        <p>No students found.</p>
      )}

      <style>
        {`
          .eye-icon:hover {
            color: green;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "25px",
    color: "#333",
  },
  searchContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  },
  searchBar: {
    padding: "10px",
    flex: "1",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  searchButton: {
    padding: "10px 16px",
    backgroundColor: "#022b56ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    margin: "10px 0",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  imageContainer: {
    marginRight: "20px",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  eyeIcon: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#007bff",
    marginLeft: "10px",
    marginTop: "10px",
    transition: "color 0.3s ease",
  },
  suspendButton: {
    padding: "6px 12px",
    backgroundColor: "#ff9800",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
  },
  removeButton: {
    padding: "6px 12px",
    backgroundColor: "#d32f2f",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
  },
  suspensionForm: {
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
  },
  dateInput: {
    padding: "5px",
    marginLeft: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  reasonInput: {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
    resize: "vertical",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  },
};

export default ViewList;

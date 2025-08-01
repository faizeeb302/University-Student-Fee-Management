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
    const fetchStudents = async () => {
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

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = searchTerm.trim()
      ? students.filter((s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : students;
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const toggleSuspension = (index) => {
    setSuspensionStates((prev) => ({
      ...prev,
      [index]: {
        show: !prev[index]?.show,
        from: "",
        to: "",
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
  const { from, to } = suspensionStates[index] || {};

  if (!from || !to) {
    Swal.fire("Missing Dates", "Please select both dates.", "warning");
    return;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (fromDate > toDate) {
    Swal.fire("Invalid Range", "`From` date must be before `To` date.", "error");
    return;
  }

  const confirmResult = await Swal.fire({
    title: "Confirm Suspension",
    html: `
      Are you sure you want to suspend <strong>${student.name}</strong> from <strong>${from}</strong> to <strong>${to}</strong>?
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Suspend",
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch("/api/suspend-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNumber: student.rollNumber,
          from,
          to,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Suspended!", `${student.name} has been suspended.`, "success");
        setSuspensionStates((prev) => ({
          ...prev,
          [index]: { show: false, from: "", to: "" },
        }));

        // Optionally update student list or state if needed
        setStudents((prev) =>
          prev.map((s) =>
            s.rollNumber === student.rollNumber
              ? { ...s, isSuspended: true }
              : s
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
      text: `Are you sure you want to remove suspension for ${student.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Call API or update state to remove suspension
        Swal.fire("Removed!", `${student.name}'s suspension has been removed.`, "success");
      }
    });
  };

  const showStudentDetails = (student) => {
    Swal.fire({
      title: `<strong>Student Details</strong>`,
      html: `
        <div style="text-align: left;">
          <img src="${student.image || '/default-avatar.png'}" alt="Student" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;" />
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Father's Name:</strong> ${student.fatherName}</p>
          <p><strong>Department:</strong> ${student.department}</p>
          <p><strong>Date of Admission:</strong> ${student.dateOfAdmission}</p>
          <p><strong>Gender:</strong> ${student.gender}</p>
          <p><strong>Date of Birth:</strong> ${student.dateOfBirth}</p>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student List</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />

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
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Department:</strong> {student.department}</p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  <button
                    onClick={() => toggleSuspension(index)}
                    style={styles.suspendButton}
                  >
                    {suspension.show ? "Hide Suspension" : "Suspend"}
                  </button>

                  {student.isSuspended && (
                    <button
                      onClick={() => removeSuspension(student)}
                      style={styles.removeButton}
                    >
                      Remove Suspension
                    </button>
                  )}
                </div>

                {suspension.show && (
                  <div style={styles.suspensionForm}>
                    <label>
                      From:
                      <input
                        type="date"
                        value={suspension.from}
                        onChange={(e) =>
                          handleSuspensionChange(index, "from", e.target.value)
                        }
                        style={styles.dateInput}
                      />
                    </label>
                    <label>
                      To:
                      <input
                        type="date"
                        value={suspension.to}
                        onChange={(e) =>
                          handleSuspensionChange(index, "to", e.target.value)
                        }
                        style={styles.dateInput}
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
  searchBar: {
    width: "100%",
    maxWidth: "300px",
    padding: "10px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
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

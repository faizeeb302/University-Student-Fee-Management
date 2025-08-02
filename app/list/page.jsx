"use client";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner/spinner";
import { IoWarningOutline } from "react-icons/io5";

const ViewList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("1st");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rollNumberError, setRollNumberError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-students");
        const data = await response.json();
        setStudents(data);
        const filtered = data.filter((s) => s.year === "1st");
        setFilteredStudents(filtered);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;

    if (searchTerm && !rollRegex.test(searchTerm)) {
      setRollNumberError("Invalid format (e.g., 21-BSCS-38)");
    } else {
      setRollNumberError("");
    }

    const filtered = students.filter((s) => {
      const matchesSearch = s.rollNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesYear = s.year === selectedYear;
      return matchesSearch && matchesYear;
    });

    setFilteredStudents(filtered);
  }, [searchTerm, selectedYear, students]);

  const showStudentDetails = (student) => {
    Swal.fire({
      title: `<strong>Student Details</strong>`,
      html: `
        <div style="text-align: left;">
          <img src="${student.image || '/default-avatar.png'}" alt="Student" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;" />
          <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Father's Name:</strong> ${student.fatherName}</p>
          <p><strong>Department:</strong> ${student.department}</p>
          <p><strong>Year:</strong> ${student.year}</p>
          <p><strong>Date of Admission:</strong> ${student.dateOfAdmission}</p>
          <p><strong>Gender:</strong> ${student.gender}</p>
          <p><strong>Date of Birth:</strong> ${student.dateOfBirth}</p>
          <p><strong>Suspended:</strong> ${student.isSuspended ? "Yes" : "No"}</p>
          <p><strong>Remaining Fee:</strong> Rs. ${student.remainingFee != null ? student.remainingFee : "0"}</p>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student List</h1>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter Roll Number (e.g., 21-BSCS-38)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBar}
          />
          {rollNumberError && (
            <div style={styles.warning}>
              <IoWarningOutline style={{ color: "#d9534f", fontSize: "1.2rem" }} />
              <span>{rollNumberError}</span>
            </div>
          )}
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={styles.dropdown}
        >
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : filteredStudents.length > 0 ? (
        filteredStudents.map((student, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardColumn}>
              <img
                src={student.image || "/default-avatar.png"}
                alt="Student"
                style={styles.image}
              />
            </div>

            <div style={styles.cardColumn}>
              <div style={styles.columnTitle}>Roll Number</div>
              <div>{student.rollNumber}</div>
            </div>

            <div style={styles.cardColumn}>
              <div style={styles.columnTitle}>Suspended</div>
              <div
                style={{
                  fontWeight: "bold",
                  color: student.isSuspended ? "red" : "green",
                }}
              >
                {student.isSuspended ? "Yes" : "No"}
              </div>
            </div>

            <div style={styles.cardColumn}>
              <div style={styles.columnTitle}>Remaining Fee</div>
              <div>
                Rs. {student.remainingFee != null ? student.remainingFee : "0"}
              </div>
            </div>

            <div style={styles.cardColumn}>
              <div style={styles.columnTitle}>View</div>
              <FaEye
                style={styles.eyeIcon}
                className="eye-icon"
                onClick={() => showStudentDetails(student)}
              />
            </div>
          </div>
        ))
      ) : (
        <p style={{ marginTop: "20px" }}>No students found.</p>
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
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "25px",
    color: "#333",
  },
  filtersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: "30px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "260px",
  },
  searchBar: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  warning: {
    color: "#d9534f",
    marginTop: "6px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dropdown: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minWidth: "180px",
    fontSize: "1rem",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    gap: "20px",
  },
  cardColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "100px",
    textAlign: "center",
  },
  columnTitle: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  eyeIcon: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#007bff",
    transition: "color 0.3s ease",
  },
};

export default ViewList;

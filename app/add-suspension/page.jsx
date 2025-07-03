"use client";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner/spinner";

const AddSuspension = () => {
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
      [index]: !prev[index],
    }));
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
        filteredStudents.map((student, index) => (
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
              <button
                onClick={() => toggleSuspension(index)}
                style={styles.suspendButton}
              >
                {suspensionStates[index] ? "Hide Suspension" : "Suspend"}
              </button>
              {suspensionStates[index] && (
                <div style={styles.suspensionForm}>
                  <label>
                    Suspension From:
                    <input type="date" style={styles.dateInput} />
                  </label>
                  <label>
                    Suspension To:
                    <input type="date" style={styles.dateInput} />
                  </label>
                </div>
              )}
            </div>
            <FaEye
              style={styles.eyeIcon}
              className="eye-icon"
              onClick={() => showStudentDetails(student)}
            />
          </div>
        ))
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
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#ff9800",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
  },
  suspensionForm: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  dateInput: {
    marginLeft: "5px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};

export default AddSuspension;

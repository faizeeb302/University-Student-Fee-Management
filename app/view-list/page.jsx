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
          <p><strong>Suspended:</strong> ${student.isSuspended ? "Yes" : "No"}</p>
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
            <img
              src={student.image || "/default-avatar.png"}
              alt="Student"
              style={styles.image}
            />
            <div style={{ flex: 1 }}>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <p>
                <strong>Suspended:</strong>{" "}
                <span
                  style={{
                    color: student.isSuspended ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {student.isSuspended ? "Yes" : "No"}
                </span>
              </p>
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
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  image: {
    width: "100px",
    height: "100px",
    marginRight: "20px",
    borderRadius: "8px",
  },
  eyeIcon: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#007bff",
    transition: "color 0.3s ease",
  },
};

export default ViewList;

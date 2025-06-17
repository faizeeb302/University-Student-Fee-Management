"use client";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const DeleteStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/get-students");
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleDelete = (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedStudents = students.filter((s) => s.id !== studentId);
        setStudents(updatedStudents);
        Swal.fire("Deleted!", "The student has been deleted.", "success");
      }
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

      <div>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <div key={index} style={styles.card}>
              <img
                src={student.image || "/default-avatar.png"}
                alt="Student"
                style={styles.image}
              />
              <div>
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Department:</strong> {student.department}
                </p>
              </div>
              <FaTrash
                style={styles.trashIcon}
                className="trash-icon"
                onClick={() => handleDelete(student.id)}
              />
            </div>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>

      <style>
        {`
          .trash-icon:hover {
            color: red;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  searchBar: {
    width: "20%",
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
  },
  trashIcon: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#dc3545",
    transition: "color 0.3s ease",
  },
};

export default DeleteStudent;

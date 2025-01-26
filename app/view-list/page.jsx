"use client"
import React, { useEffect, useState } from "react";

const ViewList = () => {
  const [students, setStudents] = useState();

  useEffect(() => {
    const fetchStudents = async () => {
        try {
          const response = await fetch("/api/get-students");
          const data = await response.json();
  
          // If the API returns a JSON string in an array, parse it
          const parsedData = data.map((item) => JSON.parse(item));
  
          setStudents(parsedData);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
  
      fetchStudents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student List</h1>
      {students?.length > 0 ? (
        students.map((student, index) => (
          <div key={index} style={styles.card}>
            <img
              src={student.image || "/default-avatar.png"}
              alt="Student"
              style={styles.image}
            />
            <div>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Father's Name:</strong> {student.fatherName}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <p><strong>Date of Admission:</strong> {student.dateOfAdmission}</p>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  image: {
    width: "100px",
    height: "100px",
    // borderRadius: "50%",
    marginRight: "20px",
  },
};

export default ViewList;

"use client"
import React, { useState } from "react";
import Swal from "sweetalert2";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    department: "",
    dateOfAdmission: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    image: "",
  });

  const departments = ["Computer Science", "Engineering", "Business", "Arts", "Law"];
  const genders = ["Male", "Female", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

//   const handleImageChange = (e) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       image: URL.createObjectURL(e.target.files[0]),
//     }));
//   };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result })); // Base64 string
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Show the review form in a SweetAlert2 modal
    Swal.fire({
      title: "<h2>Review Student Data</h2>",
      html: `
        <div style="display: flex; gap: 20px; justify-content: space-between; padding: 20px;">
          <div style="flex: 1; min-width: 300px;text-align: start;">
            <p style="margin-bottom: 10px;"><strong>Student Name:</strong> ${formData.studentName}</p>
            <p style="margin-bottom: 10px;"><strong>Father's Name:</strong> ${formData.fatherName}</p>
            <p style="margin-bottom: 10px;"><strong>Gender:</strong> ${formData.gender}</p>
            <p style="margin-bottom: 10px;"><strong>Date of Birth:</strong> ${formData.dateOfBirth}</p>
            <p style="margin-bottom: 10px;"><strong>Department:</strong> ${formData.department}</p>
            <p style="margin-bottom: 10px;"><strong>Date of Admission:</strong> ${formData.dateOfAdmission}</p>
            <p style="margin-bottom: 10px;"><strong>Email:</strong> ${formData.email}</p>
            <p style="margin-bottom: 10px;"><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
            <p style="margin-bottom: 10px;"><strong>Address:</strong> ${formData.address}</p>
          </div>
          ${
            formData.image
              ? `<div style="flex-shrink: 0; text-align: center;">
                  <img src="${formData.image}" alt="Student" style="width: 150px; height: 150px; border-radius: 10px; object-fit: cover; border: 1px solid #ccc;" />
                </div>`
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      width: "60%", // Increased modal width
      padding: "20px", // Added padding for better spacing
      customClass: {
        htmlContainer: "swal-student-review",
      },
      preConfirm: () => {
        // Process data here if needed
        return formData;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Call the save-student API
        try {
          const response = await fetch("/api/hello", {
            method: "POST",
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            throw new Error("Failed to save student data");
          }

          const data = await response.json();
          Swal.fire("Saved!", "Student information has been saved successfully.", "success");

          console.log("API Response:", data);

          setFormData({
            studentName: "",
            fatherName: "",
            department: "",
            dateOfAdmission: "",
            email: "",
            phoneNumber: "",
            address: "",
            gender: "",
            dateOfBirth: "",
            image: "",
          });

          const fileInput = document.getElementById("image");
          if (fileInput) fileInput.value = "";
        } catch (error) {
          Swal.fire("Error!", error.message, "error");
          console.error("Error saving student data:", error);
        }
      }
    });
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add Student</h1>
      <form onSubmit={handleSave} style={styles.form}>
        {/* Form Inputs */}
        {[
          { label: "Student Name", name: "studentName", type: "text" },
          { label: "Father's Name", name: "fatherName", type: "text" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Date of Admission", name: "dateOfAdmission", type: "date" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phoneNumber", type: "tel" },
          { label: "Address", name: "address", type: "textarea" },
        ].map((field, index) => (
          <div key={index} style={styles.inputGroup}>
            <label htmlFor={field.name} style={styles.label}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                style={styles.textarea}
                required
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                style={styles.input}
                required
              />
            )}
          </div>
        ))}

        {/* Gender */}
        <div style={styles.inputGroup}>
          <label htmlFor="gender" style={styles.label}>
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Gender</option>
            {genders.map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div style={styles.inputGroup}>
          <label htmlFor="department" style={styles.label}>
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div style={styles.inputGroup}>
          <label htmlFor="image" style={styles.label}>
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
            required
          />
        </div>

        {/* Save Button */}
        <button type="submit" style={styles.button}>
          Save
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "auto" },
  heading: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "5px", fontWeight: "bold" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "60px" },
  button: { padding: "10px 20px", fontSize: "16px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" },
};

export default AddStudent;

"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    department: "",
    dateOfAdmission: "",
    email: "",
    phoneNumber: "",
    emergencyContact: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    street: "",
    city: "",
    state: "",
    country: "",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const phoneRegex = /^\d{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rollRegex = /^[a-zA-Z0-9]+$/;

    if (!formData.rollNumber || !rollRegex.test(formData.rollNumber)) {
      Swal.fire("Invalid Roll Number", "Roll number must be alphanumeric.", "warning");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address.", "warning");
      return false;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      Swal.fire("Invalid Phone Number", "Phone number should be 10–15 digits.", "warning");
      return false;
    }
    if (!phoneRegex.test(formData.emergencyContact)) {
      Swal.fire("Invalid Emergency Contact", "Emergency contact should be 10–15 digits.", "warning");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    Swal.fire({
      title: "<h2>Review Student Data</h2>",
      html: `
        <div style="display: flex; gap: 20px; justify-content: space-between; padding: 20px;">
          <div style="flex: 1; min-width: 300px; text-align: start;">
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Personal Information</h3>
              <p><strong>Roll Number:</strong> ${formData.rollNumber}</p>
              <p><strong>Full Name:</strong> ${formData.firstName} ${formData.lastName}</p>
              <p><strong>Father's Name:</strong> ${formData.fatherName}</p>
              <p><strong>Gender:</strong> ${formData.gender}</p>
              <p><strong>Date of Birth:</strong> ${formData.dateOfBirth}</p>
            </div>
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">University Information</h3>
              <p><strong>Department:</strong> ${formData.department}</p>
              <p><strong>Date of Admission:</strong> ${formData.dateOfAdmission}</p>
            </div>
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Contact Information</h3>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
              <p><strong>Emergency Contact:</strong> ${formData.emergencyContact}</p>
            </div>
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Address</h3>
              <p>${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}</p>
            </div>
          </div>
          ${formData.image ? `<div><img src="${formData.image}" style="width:150px;height:150px;border-radius:10px;border:1px solid #ccc;object-fit:cover;" /></div>` : ""}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      width: "60%",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedFormData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`.trim(),
          };
          delete updatedFormData.firstName;
          delete updatedFormData.lastName;

          const response = await fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
          });

          if (!response.ok) {
            throw new Error("Failed to save student data");
          }

          await response.json();
          Swal.fire("Saved!", "Student information has been saved successfully.", "success");

          setFormData({
            rollNumber: "",
            firstName: "",
            lastName: "",
            fatherName: "",
            department: "",
            dateOfAdmission: "",
            email: "",
            phoneNumber: "",
            emergencyContact: "",
            gender: "",
            dateOfBirth: "",
            image: "",
            street: "",
            city: "",
            state: "",
            country: "",
          });

          const fileInput = document.getElementById("image");
          if (fileInput) fileInput.value = "";
        } catch (error) {
          Swal.fire("Error!", error.message, "error");
        }
      }
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add Student</h1>
      <form onSubmit={handleSave} style={styles.form}>
        {/* Personal Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Personal Information</h2>
          <div style={styles.row}>
            {[
              { label: "Roll Number", name: "rollNumber" },
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
            ].map((field, i) => (
              <div key={i} style={styles.inputGroup}>
                <label style={styles.label}>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            ))}
          </div>
          {[
            { label: "Father's Name", name: "fatherName" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          ].map((field, i) => (
            <div key={i} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          ))}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Gender</option>
              {genders.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* University Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>University Information</h2>
          <div style={styles.row}>
            {[
              { label: "Department", name: "department" },
              { label: "Date of Admission", name: "dateOfAdmission", type: "date" },
            ].map((field, i) => (
              <div key={i} style={styles.inputGroup}>
                <label style={styles.label}>{field.label}</label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Contact Information</h2>
          <div style={styles.row}>
            {[
              { label: "Email", name: "email", type: "email" },
              { label: "Phone Number", name: "phoneNumber", type: "tel" },
              { label: "Emergency Contact", name: "emergencyContact", type: "tel" },
            ].map((field, i) => (
              <div key={i} style={styles.inputGroup}>
                <label style={styles.label}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Address</h2>
          <div style={styles.row}>
            {["street", "city", "state", "country"].map((name, i) => (
              <div key={i} style={styles.inputGroup}>
                <label style={styles.label}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Upload Image</h2>
          <input
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Save Student
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "30px",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  section: {
    padding: "10px 0",
  },
  sectionHeading: {
    fontSize: "1.25rem",
    marginBottom: "15px",
    color: "#222",
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  inputGroup: {
    flex: 1,
    minWidth: "220px",
    marginBottom: "10px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "12px 24px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};

export default AddStudent;

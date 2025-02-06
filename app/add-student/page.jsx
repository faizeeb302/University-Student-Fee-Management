"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AddStudent = () => {
  const [formData, setFormData] = useState({
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
          <div style="flex: 1; min-width: 300px; text-align: start;">
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Personal Information</h3>
              <p style="margin-bottom: 10px; margin-top: 10px;"><strong>Full Name:</strong> ${formData.firstName} ${formData.lastName}</p>
              <p style="margin-bottom: 10px;"><strong>Father's Name:</strong> ${formData.fatherName}</p>
              <p style="margin-bottom: 10px;"><strong>Gender:</strong> ${formData.gender}</p>
              <p style="margin-bottom: 10px;"><strong>Date of Birth:</strong> ${formData.dateOfBirth}</p>
            </div>
  
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">University Information</h3>
              <p style="margin-bottom: 10px; margin-top: 10px;"><strong>Department:</strong> ${formData.department}</p>
              <p style="margin-bottom: 10px;"><strong>Date of Admission:</strong> ${formData.dateOfAdmission}</p>
            </div>
  
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Contact Information</h3>
              <p style="margin-bottom: 10px; margin-top: 10px;"><strong>Email:</strong> ${formData.email}</p>
              <p style="margin-bottom: 10px;"><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
              <p style="margin-bottom: 10px;"><strong>Emergency Contact:</strong> ${formData.emergencyContact}</p>
            </div>
  
            <div style="margin-bottom: 30px;">
              <h3 style="font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Address</h3>
              <p style="margin-bottom: 10px; margin-top: 10px;"> ${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}</p>
            </div>
          </div>
          ${formData.image
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

          const updatedFormData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`.trim(), // Combine firstName and lastName
          };

          // Remove firstName and lastName if not needed
          delete updatedFormData.firstName;
          delete updatedFormData.lastName;

          const response = await fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData), // Convert updated data to a JSON string
          });


          if (!response.ok) {
            throw new Error("Failed to save student data");
          }

          const data = await response.json();
          Swal.fire("Saved!", "Student information has been saved successfully.", "success");

          console.log("API Response:", data);

          setFormData({
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
          console.error("Error saving student data:", error);
        }
      }
    });
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add Student</h1>
      <form onSubmit={handleSave} style={styles.form}>
        {/* Personal Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Personal Information</h2>
          {/* First Name and Last Name in the same row */}
          <div style={styles.row}>
            {[{ label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" }].map((field, index) => (
              <div key={index} style={styles.inputGroup}>
                <label htmlFor={field.name} style={styles.label}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>
          {[{ label: "Father's Name", name: "fatherName", type: "text" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" }].map((field, index) => (
            <div key={index} style={styles.inputGroup}>
              <label htmlFor={field.name} style={styles.label}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          ))}
          {/* Gender Field */}
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
        </div>

        {/* University Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>University Information</h2>
          <div style={styles.row}>
            {[{ label: "Department", name: "department", type: "text" },
            { label: "Date of Admission", name: "dateOfAdmission", type: "date" }].map((field, index) => (
              <div key={index} style={styles.inputGroup}>
                <label htmlFor={field.name} style={styles.label}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Contact Information</h2>
          <div style={styles.row}>
            {[{ label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phoneNumber", type: "tel" },
            { label: "Emergency Contact", name: "emergencyContact", type: "tel" }].map((field, index) => (
              <div key={index} style={styles.inputGroup}>
                <label htmlFor={field.name} style={styles.label}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Address</h2>
          <div style={styles.row}>
            {[{ label: "Street", name: "street", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "Country", name: "country", type: "text" }].map((field, index) => (
              <div key={index} style={styles.inputGroup}>
                <label htmlFor={field.name} style={styles.label}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                  required
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
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  heading: {
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  section: {
    padding: "10px 0",
  },
  sectionHeading: {
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
  },
  inputGroup: {
    flex: 1,
    minWidth: "200px",
  },
  label: {
    fontSize: "1em",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1em",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AddStudent;

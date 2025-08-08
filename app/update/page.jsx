"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoWarningOutline } from "react-icons/io5";
import { Country, State, City } from "country-state-city";
import ClientOnlySelect from "../../components/CustomSelect/clientOnlySelect";

const UpdateStudent = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rollNumberError, setRollNumberError] = useState("");

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const degreeTypes = ["BS", "BE"];
  const residenceOptions = ["Urban", "Rural"];
  const genders = ["Male", "Female", "Other"];

  const countryOptions = countries.map((c) => ({ value: c.name, label: c.name, isoCode: c.isoCode }));
  const stateOptions = states.map((s) => ({ value: s.name, label: s.name, isoCode: s.isoCode }));
  const residenceTypeOptions = residenceOptions.map((r) => ({ value: r, label: r }));
  const cityOptions = cities.map((city) => ({ value: city.name, label: city.name }));
  const yearOptions = Array.from({ length: 51 }, (_, i) => ({ label: (2000 + i).toString(), value: (2000 + i).toString() }));

  const handleSearch = async () => {
    const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
    if (!rollRegex.test(rollNumber)) {
      setRollNumberError("Invalid roll number format (e.g., 21-BSCS-38)");
      return;
    }
    setRollNumberError("");

   try {
       const res = await fetch("/api/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rollNumber: rollNumber
          }),
        });
      if (!res.ok) throw new Error("Student not found");
      const data = await res.json();

      data.dateOfAdmission = data.dateOfAdmission?.split("T")[0] || "";
      data.dateOfBirth = data.dateOfBirth?.split("T")[0] || "";

      setStudentData(data);
      setIsEditing(false);

      const selectedCountry = countries.find((c) => c.name === data.country);
      const countryStates = State.getStatesOfCountry(selectedCountry?.isoCode);
      setStates(countryStates);

      const selectedState = countryStates.find((s) => s.name === data.state);
      const stateCities = City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode);
      setCities(stateCities);
    } catch (err) {
      Swal.fire("Not Found", "No student found with this roll number", "warning");
      setStudentData(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" || name === "emergencyContact" ? value.replace(/\D/g, "") : value,
    }));
  };

  const validateFields = () => {
    const phoneRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!rollRegex.test(studentData.rollNumber)) return "Invalid roll number.";
    if (!nameRegex.test(studentData.firstName)) return "Invalid first name.";
    if (!nameRegex.test(studentData.lastName)) return "Invalid last name.";
    if (!nameRegex.test(studentData.fatherName)) return "Invalid father's name.";
    if (!emailRegex.test(studentData.email)) return "Invalid email.";
    if (!phoneRegex.test(studentData.phoneNumber)) return "Invalid phone number.";
    if (!phoneRegex.test(studentData.emergencyContact)) return "Invalid emergency contact.";
    if (studentData.phoneNumber === studentData.emergencyContact) return "Phone number and emergency contact cannot be the same.";
    return null;
  };

  const handleUpdate = async () => {
    const error = validateFields();
    if (error) {
      Swal.fire("Validation Error", error, "warning");
      return;
    }

    Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to update this student's info?",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/update-student", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
          });

          if (!res.ok) throw new Error("Failed to update");
          Swal.fire("Updated!", "Student information has been updated.", "success");
          setIsEditing(false);
        } catch (err) {
          Swal.fire("Error", err.message, "error");
        }
      }
    });
  };

  const renderInput = (label, name, type = "text") => (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        value={studentData?.[name] || ""}
        onChange={handleChange}
        disabled={!isEditing}
        type={type}
        style={styles.input}
        required
      />
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Update Student</h1>
      <h3 style={styles.subHeading}>Quaid-e-Awam University of Engineering, Science and Technology</h3>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter Roll Number (e.g., 21-BSCS-38)"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>Search</button>
        {rollNumberError && (
          <div style={styles.warning}>
            <IoWarningOutline style={{ color: "#d9534f" }} />
            <span>{rollNumberError}</span>
          </div>
        )}
      </div>

      {studentData && (
        <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Personal Information</h2>
            <div style={styles.row}>
              {renderInput("First Name", "firstName")}
              {renderInput("Last Name", "lastName")}
              {renderInput("Father's Name", "fatherName")}
              {renderInput("Date of Birth", "dateOfBirth", "date")}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Gender</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={genders.map((g) => ({ label: g, value: g }))}
                  value={studentData.gender ? { label: studentData.gender, value: studentData.gender } : null}
                  onChange={(selected) => setStudentData((prev) => ({ ...prev, gender: selected?.value || "" }))}
                  placeholder="Select Gender"
                />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>University Information</h2>
            <div style={styles.row}>
              {renderInput("Department", "department")}
              {renderInput("Date of Admission", "dateOfAdmission", "date")}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Year</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={yearOptions}
                  value={studentData.year ? { label: studentData.year, value: studentData.year } : null}
                  onChange={(selected) => setStudentData((prev) => ({ ...prev, year: selected?.value || "" }))}
                  placeholder="Select Year"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Degree Type</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={degreeTypes.map((d) => ({ label: d, value: d }))}
                  value={studentData.degreeType ? { label: studentData.degreeType, value: studentData.degreeType } : null}
                  onChange={(selected) => setStudentData((prev) => ({ ...prev, degreeType: selected?.value || "" }))}
                  placeholder="Select Degree Type"
                />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Contact Information</h2>
            <div style={styles.row}>
              {renderInput("Email", "email")}
              {renderInput("Phone Number", "phoneNumber")}
              {renderInput("Emergency Contact", "emergencyContact")}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Address</h2>
            <div style={styles.row}>
              {renderInput("Street", "street")}
              {renderInput("District", "district")}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Country</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={countryOptions}
                  value={countryOptions.find((c) => c.value === studentData.country) || null}
                  onChange={(selected) => {
                    const selectedCountry = selected;
                    const countryStates = State.getStatesOfCountry(selectedCountry?.isoCode);
                    setStates(countryStates);
                    setCities([]);
                    setStudentData((prev) => ({
                      ...prev,
                      country: selectedCountry?.value || "",
                      state: "",
                      city: "",
                    }));
                  }}
                  placeholder="Select Country"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={stateOptions}
                  value={stateOptions.find((s) => s.value === studentData.state) || null}
                  onChange={(selected) => {
                    const selectedState = selected;
                    const selectedCountry = countries.find((c) => c.name === studentData.country);
                    const stateCities = City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode);
                    setCities(stateCities);
                    setStudentData((prev) => ({
                      ...prev,
                      state: selectedState?.value || "",
                      city: "",
                    }));
                  }}
                  placeholder="Select State"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={cityOptions}
                  value={studentData.city ? { label: studentData.city, value: studentData.city } : null}
                  onChange={(selected) => setStudentData((prev) => ({ ...prev, city: selected?.value || "" }))}
                  placeholder="Select City"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Residence Type</label>
                <ClientOnlySelect
                  isDisabled={!isEditing}
                  options={residenceTypeOptions}
                  value={residenceTypeOptions.find((r) => r.value === studentData.residenceType) || null}
                  onChange={(selected) => setStudentData((prev) => ({ ...prev, residenceType: selected?.value || "" }))}
                  placeholder="Select Residence Type"
                />
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={styles.button}>Edit</button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleUpdate} style={{ ...styles.button, backgroundColor: "#007bff" }}>
                Confirm Update
              </button>
              <button onClick={() => setIsEditing(false)} style={{ ...styles.button, backgroundColor: "#6c757d" }}>
                Cancel
              </button>
            </div>
          )}
        </form>
      )}
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
    fontSize: "2.25rem",
    fontWeight: "500",
    marginBottom: "10px",
    color: "#333",
  },
  subHeading: {
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#333",
  },
  section: {
    padding: "10px 0",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    marginBottom: "15px",
    color: "#222",
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
  },
  row: {
    display: "flex",
    gap: "10px",
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
    width: "70%",
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
   backgroundColor: "#022b56ff",
    color: "#fff",
    padding: "12px 24px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  warning: {
    color: "#d9534f",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  searchBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    margin: "auto 8px",
    gap: "10px",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
};

export default UpdateStudent;

"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoWarningOutline } from "react-icons/io5";
import { Country, State, City } from "country-state-city";
import ClientOnlySelect from "../../components/CustomSelect/clientOnlySelect";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    department: "",
    degreeType: "", // <-- New field
    year: "",
    dateOfAdmission: "",
    email: "",
    phoneNumber: "",
    emergencyContact: "",
    gender: "",
    dateOfBirth: "",
    image: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    residenceType: "",
    isSuspended: false,
  });

  const [rollNumberError, setRollNumberError] = useState("");
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const startYear = 2000;
  const endYear = 2050;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());
  const departments = ["Computer Science", "Engineering", "Business", "Arts", "Law"];
  const degreeTypes = ["BS", "BE"];
  const genders = ["Male", "Female", "Other"];
  const residenceOptions = ["Urban", "Rural"];

  const countryOptions = countries.map((c) => ({
    value: c.name,
    label: c.name,
    isoCode: c.isoCode,
  }));

  const stateOptions = states.map((s) => ({
    value: s.name,
    label: s.name,
    isoCode: s.isoCode,
  }));

  const residenceTypeOptions = residenceOptions.map((r) => ({
    value: r,
    label: r,
  }));

  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));

  const capitalizeLabel = (text) => {
    if (!text) return "";
    const label = text.replace(/([A-Z])/g, " $1").trim();
    return text == "fatherName" ? "Father's Name" : label.charAt(0).toUpperCase() + label.slice(1);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    let tempValue = "";

    if (name === "phoneNumber" || name === "emergencyContact") {
      value = value.replace(/\D/g, "");
    }

    if (name === "rollNumber") {
      const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
      if (value && !rollRegex.test(value)) {
        setRollNumberError("Roll number must be in format: 21-BSCS-38");
      } else {
        setRollNumberError("");
      }
    }

    if (name === "country") {
      const selectedCountry = countries.find((c) => c.name === value);
      tempValue = selectedCountry?.name;
      const countryStates = State.getStatesOfCountry(selectedCountry?.isoCode);
      setStates(countryStates);
      setCities([]);
      setFormData((prevData) => ({ ...prevData, state: "", city: "" }));
    }

    if (name === "state") {
      const selectedCountry = countries.find((c) => c.name === formData.country);
      const selectedState = states.find((c) => c.name === value);
      tempValue = selectedState?.name;
      const stateCities = City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode);
      setCities(stateCities);
      setFormData((prevData) => ({ ...prevData, city: "" }));
    }

    tempValue = tempValue === "" ? value : tempValue;

    setFormData((prevData) => ({
      ...prevData,
      [name]: tempValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 1001 * 1024;
    if (file.size > maxSize) {
      Swal.fire("Image Too Large", "Please upload an image smaller than 1MB.", "warning");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateFields = () => {
    const phoneRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.rollNumber || !rollRegex.test(formData.rollNumber)) {
      Swal.fire("Invalid Roll Number", "Roll number must be alphanumeric.", "warning");
      return false;
    }

    if (!nameRegex.test(formData.firstName)) {
      Swal.fire("Invalid First Name", "Only alphabet characters and spaces are allowed in First Name.", "warning");
      return false;
    }

    if (!nameRegex.test(formData.lastName)) {
      Swal.fire("Invalid Last Name", "Only alphabet characters and spaces are allowed in Last Name.", "warning");
      return false;
    }

    if (!nameRegex.test(formData.fatherName)) {
      Swal.fire("Invalid Father's Name", "Only alphabet characters and spaces are allowed in Father's Name.", "warning");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address.", "warning");
      return false;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      Swal.fire("Invalid Phone Number", "Phone number should be 11 digits.", "warning");
      return false;
    }

    if (!phoneRegex.test(formData.emergencyContact)) {
      Swal.fire("Invalid Emergency Contact", "Emergency contact should be 11 digits.", "warning");
      return false;
    }

    if (formData.phoneNumber === formData.emergencyContact) {
      Swal.fire("Invalid Contact Numbers", "Phone number and emergency contact cannot be the same.", "warning");
      return false;
    }

    if (!formData.country || !formData.state || !formData.city) {
      Swal.fire("Incomplete Address", "Please select country, state, and city.", "warning");
      return false;
    }

    if (!formData.residenceType) {
      Swal.fire("Missing Information", "Please select whether the student resides in an Urban or Rural area.", "warning");
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
              <p><strong>Degree:</strong> ${formData.degreeType}</p>
              <p><strong>Year:</strong> ${formData.year} Year</p>
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
              <p>${formData.street}, ${formData.city}, ${formData.district}, ${formData.state}, ${formData.country}</p>
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
          const response = await fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!response.ok) throw new Error("Failed to save student data");

          await response.json();
          Swal.fire("Saved!", "Student information has been saved successfully.", "success");

          setFormData({
            rollNumber: "",
            firstName: "",
            lastName: "",
            fatherName: "",
            department: "",
            degreeType: "", // <-- Reset here too
            year: "1st",
            dateOfAdmission: "",
            email: "",
            phoneNumber: "",
            emergencyContact: "",
            gender: "",
            dateOfBirth: "",
            image: "",
            street: "",
            city: "",
            district: "",
            state: "",
            country: "",
            residenceType: "",
            isSuspended: false,
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
      <h3 style={styles.subHeading}>Quaid-e-Awam University of Engineering, Science and Technology</h3>
      <form onSubmit={handleSave} style={styles.form}>
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Personal Information</h2>
          <div style={styles.row}>
            {["rollNumber", "firstName", "lastName"].map((name) => (
              <div key={name} style={styles.inputGroup}>
                <label style={styles.label}>{capitalizeLabel(name)}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                {name === "rollNumber" && rollNumberError && (
                  <div style={styles.warning}>
                    <IoWarningOutline style={{ color: "#d9534f", fontSize: "1.2rem" }} />
                    <span>Invalid Roll Number <span style={styles.example}>(e.g., 21-BSCS-38)</span></span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {["fatherName", "dateOfBirth"].map((name, i) => (
            <div key={i} style={styles.inputGroup}>
              <label style={styles.label}>{capitalizeLabel(name)}</label>
              <input type={name === "dateOfBirth" ? "date" : "text"} name={name} value={formData[name]} onChange={handleChange} required style={styles.input} />
            </div>
          ))}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.input}>
              <option value="">Select Gender</option>
              {genders.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>University Information</h2>
          <div style={styles.row}>
         <div style={styles.inputGroup}>
  <label style={styles.label}>Department</label>
  <input
    type="text"
    name="department"
    value={formData.department}
    onChange={handleChange}
    placeholder="Enter Department Name"
    required
    style={styles.input}
  />
</div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Degree Type</label>
              <ClientOnlySelect
                options={degreeTypes.map((d) => ({ label: d, value: d }))}
                value={formData.degreeType ? { label: formData.degreeType, value: formData.degreeType } : null}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, degreeType: selected?.value || "" }))
                }
                placeholder="Select Degree"
                isSearchable
                styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Year</label>
              <ClientOnlySelect
                options={years.map((y) => ({ label: y, value: y }))}
                value={formData.year ? { label: formData.year, value: formData.year } : null}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, year: selected?.value || "" }))
                }
                placeholder="Select Year"
                isSearchable
                styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
              />

            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Admission</label>
              <input
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
        </div>


        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Contact Information</h2>
          <div style={styles.row}>
            {["email", "phoneNumber", "emergencyContact"].map((name) => (
              <div key={name} style={styles.inputGroup}>
                <label style={styles.label}>{capitalizeLabel(name)}</label>
                <input type={name === "email" ? "email" : "tel"} name={name} value={formData[name]} onChange={handleChange} required style={styles.input} />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Address</h2>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Country</label>
              <ClientOnlySelect
                instanceId="country-select"
                options={countryOptions}
                isSearchable
                value={countryOptions.find((c) => c.value === formData.country) || null}
                onChange={(selected) => {
                  const selectedCountry = selected;
                  const countryStates = State.getStatesOfCountry(selectedCountry?.isoCode);
                  setStates(countryStates);
                  setCities([]);
                  setFormData((prev) => ({
                    ...prev,
                    country: selectedCountry?.value || "",
                    state: "",
                    city: "",
                  }));
                }}
                placeholder="Select Country"
                styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
              />
            </div>


            <div style={styles.inputGroup}>
              <label style={styles.label}>State</label>
              <ClientOnlySelect
                options={stateOptions}
                isSearchable
                value={stateOptions.find((s) => s.value === formData.state) || null}
                onChange={(selected) => {
                  const selectedState = selected;
                  const selectedCountry = countries.find((c) => c.name === formData.country);
                  const stateCities = City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode);
                  setCities(stateCities);
                  setFormData((prev) => ({
                    ...prev,
                    state: selectedState?.value || "",
                    city: "",
                  }));
                }}
                placeholder="Select State"
                styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
              />
            </div>


            <div style={styles.inputGroup}>
              <label style={styles.label}>City</label>
              <ClientOnlySelect
                options={cityOptions}
                isClearable
                isSearchable
                placeholder="Select or type a city"
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    city: selectedOption ? selectedOption.value : "",
                  }));
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    setFormData((prev) => ({
                      ...prev,
                      city: inputValue,
                    }));
                  }
                }}
                value={formData.city ? { label: formData.city, value: formData.city } : null}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "42px",
                    fontSize: "1rem",
                  }),
                }}
              />
            </div>


            <div style={styles.inputGroup}>
              <label style={styles.label}>Residence Type</label>
              <ClientOnlySelect
                options={residenceTypeOptions}
                isSearchable
                value={residenceTypeOptions.find((r) => r.value === formData.residenceType) || null}
                onChange={(selected) => {
                  setFormData((prev) => ({ ...prev, residenceType: selected?.value || "" }));
                }}
                placeholder="Select Area"
                styles={{ control: (base) => ({ ...base, minHeight: "42px" }) }}
              />
            </div>


            <div style={styles.inputGroup}>
              <label style={styles.label}>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Street</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} style={styles.input} />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Upload Image</h2>
          <input id="image" name="image" type="file" onChange={handleImageChange} accept="image/*" style={styles.input} />
        </div>

        <button type="submit" style={styles.button}>Save Student</button>
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
    fontSize: "2.25rem",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#333",
  },
  subHeading: {
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "500",
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
  warning: {
    color: "#d9534f",
    marginTop: "5px",
    fontSize: "0.9rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  example: {
    fontStyle: "italic",
    fontWeight: "400",
    marginLeft: "4px",
    color: "#a94442",
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

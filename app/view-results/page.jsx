"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoWarningOutline } from "react-icons/io5";

const ViewResult = () => {
  const [roll, setRoll] = useState("");
  const [semester, setSemester] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
  const [rollNumberError, setRollNumberError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateRoll = (value) => {
    const rollRegex = /^\d{2}-[A-Z]{2,5}-\d+$/;
    return rollRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRoll(roll)) {
      Swal.fire("Invalid Roll Number", "Roll number must be in format: 21-BSCS-38", "warning");
      return;
    }

    if (!semester) {
      Swal.fire("Missing Semester", "Please select a semester.", "warning");
      return;
    }

    setLoading(true);
    setError("");
    setStudentData(null);

    try {
      // Fetch student info
      const studentRes = await fetch("/api/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rollNumber: roll
          }),
        });
      if (!studentRes.ok) throw new Error("Student not found");

      const student = await studentRes.json();

      // Fetch subject results
      const resultRes = await fetch(`/api/get-results?rollNumber=${roll}&semester=${semester}`);
      if (!resultRes.ok) throw new Error("Results not found");

      const resultData = await resultRes.json();

      if (!resultData.results || resultData.results.length === 0) {
        setError("No results found.");
        return;
      }

      setStudentData({
        name: `${student.firstName} ${student.lastName}`,
        roll: student.rollNumber,
        className: `Semester ${semester}`,
        subjects: resultData.results.map((r) => ({
          subject: r.subjectName,
          status: r.status,
        })),
      });
    } catch (err) {
      console.error(err);
      setError("Result not found or API error.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    const confirm = await Swal.fire({
      title: "Go Back?",
      text: "Do you want to check another result?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      setStudentData(null);
      setRoll("");
      setSemester("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">View Results</h1>

      {!studentData ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            QUEST Result Management System
          </h2>

          <label className="block mb-2 font-semibold">Enter your Roll Number</label>
          <input
            type="text"
            value={roll}
            onChange={(e) => {
              const value = e.target.value;
              setRoll(value);
              setRollNumberError(validateRoll(value) ? "" : "Roll number must be in format: 21-BSCS-38");
            }}
            className="w-full mb-1 p-2 border border-gray-300 rounded"
            placeholder="Enter Roll Number"
            required
          />
          {rollNumberError && (
            <div className="text-red-600 text-sm flex items-center gap-2 mb-3 font-medium">
              <IoWarningOutline className="text-lg" />
              <span>
                Invalid Roll Number <span className="italic font-normal">(e.g., 21-BSCS-38)</span>
              </span>
            </div>
          )}

          <label className="block mb-2 font-semibold">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, idx) => (
              <option key={idx} value={idx + 1}>
                Semester {idx + 1}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </form>
      ) : (
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <p className="mb-1">
            <strong>Student Name :</strong> {studentData.name}
          </p>
          <p className="mb-1">
            <strong>Student Roll Id :</strong> {studentData.roll}
          </p>
          <p className="mb-4">
            <strong>Student Class :</strong> {studentData.className}
          </p>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentData.subjects.map((s, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{s.subject}</td>
                  <td
                    className={`border p-2 font-semibold text-center ${
                      s.status === "Fail" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleBack}
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewResult;

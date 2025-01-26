"use client"
import React, { useState } from "react";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", age: "", grade: "" });
  const [editIndex, setEditIndex] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or update student
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Update existing student
      const updatedStudents = students.map((student, index) =>
        index === editIndex ? formData : student
      );
      setStudents(updatedStudents);
      setEditIndex(null);
    } else {
      // Add new student
      setStudents([...students, formData]);
    }

    // Reset form
    setFormData({ name: "", age: "", grade: "" });
  };

  // Edit student
  const handleEdit = (index) => {
    setFormData(students[index]);
    setEditIndex(index);
  };

  // Delete student
  const handleDelete = (index) => {
    const filteredStudents = students.filter((_, i) => i !== index);
    setStudents(filteredStudents);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Admin Dashboard - Student Management
      </h1>

      {/* Form to Add/Update Student */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editIndex !== null ? "Edit Student" : "Add Student"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            {editIndex !== null ? "Update Student" : "Add Student"}
          </button>
        </form>
      </div>

      {/* Student List */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Student List</h2>
        {students.length === 0 ? (
          <p className="text-gray-500">No students added yet.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{student.name}</td>
                  <td className="p-2 border">{student.age}</td>
                  <td className="p-2 border">{student.grade}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

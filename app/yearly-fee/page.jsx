"use client"
import React, { useState } from "react";

const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

const YearlyFee = () => {
  const [year, setYear] = useState(2025);
  const [fees, setFees] = useState(
    semesters.map(() => ({ fee: "", dueDate: "", isEditing: false }))
  );

  const handleEditToggle = (index) => {
    const updated = [...fees];
    updated[index].isEditing = !updated[index].isEditing;
    setFees(updated);
  };

  const handleFeeChange = (index, value) => {
    const updated = [...fees];
    updated[index].fee = value;
    setFees(updated);
  };

  const handleDateChange = (index, value) => {
    const updated = [...fees];
    updated[index].dueDate = value;
    setFees(updated);
  };

  const handleConfirm = (index) => {
    const updated = [...fees];
    updated[index].isEditing = false;
    setFees(updated);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Yearly Fee Setup</h2>

      <div className="mb-6">
        <label htmlFor="year" className="block text-sm font-medium mb-1">
          Select Year
        </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-3 py-2 w-40"
        />
      </div>

      <div className="space-y-4">
        {semesters.map((label, index) => (
          <div
            key={index}
            className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="font-semibold">{label}</div>
            <input
              type="number"
              placeholder="Semester Fee"
              value={fees[index].fee}
              onChange={(e) => handleFeeChange(index, e.target.value)}
              disabled={!fees[index].isEditing}
              className="border rounded px-3 py-2 w-full md:w-40"
            />

            <div className="font-semibold">Due Date</div>
            <div className="w-full md:w-48">
              {/* <label className="block text-sm font-medium mb-1">Due Date</label> */}
              <input
                type="date"
                value={fees[index].dueDate}
                onChange={(e) => handleDateChange(index, e.target.value)}
                disabled={!fees[index].isEditing}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditToggle(index)}
                className="px-3 py-2 text-sm border rounded bg-gray-100 hover:bg-gray-200"
              >
                {fees[index].isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={() => handleConfirm(index)}
                disabled={!fees[index].isEditing}
                className={`px-3 py-2 text-sm border rounded ${
                  fees[index].isEditing
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearlyFee;

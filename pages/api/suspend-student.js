import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { rollNumber, from, to } = req.body;

    if (!rollNumber || !from || !to) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const filePath = path.join(process.cwd(), "data", "students.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Student data not found." });
    }

    const fileData = fs.readFileSync(filePath, "utf8");
    let students = [];

    try {
      students = JSON.parse(fileData);
    } catch (error) {
      return res.status(500).json({ message: "Failed to parse student data." });
    }

    // Find the student by roll number
    const studentIndex = students.findIndex(
      (student) => student.rollNumber === rollNumber
    );

    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Update suspension fields
    students[studentIndex] = {
      ...students[studentIndex],
      isSuspended: true,
      suspensionFrom: from,
      suspensionTo: to,
    };

    // Save back to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
      return res.status(200).json({ message: "Student suspended successfully." });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update student data." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

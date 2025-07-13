import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const newStudent = req.body;

    // console.log("Received student data:", newStudent); // Log the received data

    const filePath = path.join(process.cwd(), "data", "students.json");

    // Ensure the "data" folder exists
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // Create the file with the new student as the first entry
      fs.writeFileSync(filePath, JSON.stringify([newStudent], null, 2));
      res.status(200).json({ message: "Student saved successfully!" });
    } else {
      // File exists, check its contents
      let students = [];
      const fileData = fs.readFileSync(filePath, "utf8");

      if (fileData.trim()) {
        // File is not empty, parse its contents
        students = JSON.parse(fileData);
      }

      // Add the new student
      students.push(newStudent);

      // Save the updated data
      fs.writeFileSync(filePath, JSON.stringify(students, null, 2));

      res.status(200).json({ message: "Student saved successfully!" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

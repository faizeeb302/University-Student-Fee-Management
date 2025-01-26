// pages/api/get-students.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "data", "students.json");

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      console.log("file",fileData)
      const students = JSON.parse(fileData);
      console.log("students",students)
      res.status(200).json(students);
    } else {
      res.status(200).json([]); // Return empty array if file doesn't exist
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

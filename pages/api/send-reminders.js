import nodemailer from 'nodemailer';
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("Fetching dueDate...");

      const [overdueStudents] = await db.query(
       `
    SELECT si.rollNumber, si.email, si.firstName, si.lastName,
           yf.year, yf.semesterType, yf.dueDate
    FROM student_info si
    JOIN yearly_fee yf
    LEFT JOIN fees f
      ON f.rollNumber = si.rollNumber
     AND f.semesterYear = yf.year
     AND f.semesterType = yf.semesterType
     AND f.submissionDate IS NOT NULL
    WHERE yf.dueDate < CURRENT_DATE
      AND f.id IS NULL
    `
  );

      // // const overdueStudents = overdueResult[0]; // mysql2 format: [rows, fields]

      // console.log("Overdue students:", overdueStudents);

      if (!overdueStudents || overdueStudents.length === 0) {
        return res.status(200).json({ message: 'No overdue unpaid students found.' });
      }

      // Step 3: Setup nodemailer
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      // Step 4: Send reminder emails
      for (const student of overdueStudents) {
        await transporter.sendMail({
          from: `"Fee Reminder" <${process.env.EMAIL_USER}>`,
          to: student.email,
          subject: 'Fee Payment Reminder',
          text: `Dear student ${student?.firstName} ${student?.lastName} (Roll No: ${student.rollNumber}),

Your semester fee was due on ${new Date(student.dueDate).toLocaleDateString()}, but we haven't received your payment yet.

Please make your payment as soon as possible to avoid late fees or academic holds.

Thank you.`,
        });
      }

      res.status(200).json({ message: `Reminder emails sent to ${overdueStudents.length} students.` });

    } catch (error) {
      console.error('Reminder Email Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

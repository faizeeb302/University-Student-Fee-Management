import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { rollNumber, fromDate, toDate, reason } = req.body;

    if (!rollNumber || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert into suspension table
    const insertQuery = `
      INSERT INTO suspension (rollNumber, fromDate, toDate, reason)
      VALUES (?, ?, ?, ?)
    `;
    const insertValues = [rollNumber, fromDate, toDate, reason];
    await db.execute(insertQuery, insertValues);

    // ✅ Correct column name: roll_number
    const updateQuery = `
      UPDATE student_info SET isSuspended = TRUE WHERE rollNumber = ?
    `;
    await db.execute(updateQuery, [rollNumber]);

    res.status(200).json({ message: 'Student suspended successfully' });
  } catch (error) {
    console.error('Error suspending student:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

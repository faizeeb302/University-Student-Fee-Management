import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { year, semesterType, dueDate } = req.body;

    if (!year || !semesterType || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert or update (in case of re-entry)
    const query = `
      INSERT INTO yearly_fee (year, semesterType, dueDate)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        dueDate = VALUES(dueDate)
    `;

    const values = [year, semesterType, dueDate];

    const [result] = await db.execute(query, values);

    res.status(200).json({ message: 'Yearly fee entry saved successfully' });
  } catch (error) {
    console.error('Error saving yearly fee:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

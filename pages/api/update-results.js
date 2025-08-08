import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { rollNumber, semester, subjectName, status } = req.body;

    if (!rollNumber || !semester || !subjectName || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Pass', 'Fail'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either Pass or Fail' });
    }

    const query = `
      INSERT INTO update_results (rollNumber, semester, subjectName, status)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status = VALUES(status)
    `;

    const values = [rollNumber, semester, subjectName, status];

    const [result] = await db.execute(query, values);

    const message = result.affectedRows === 1
      ? 'Subject result inserted'
      : 'Subject result updated';

    res.status(200).json({ message });
  } catch (error) {
    console.error('Error in update-result API:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

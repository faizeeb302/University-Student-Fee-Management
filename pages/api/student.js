import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { rollNumber } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: 'rollNumber is required' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM student_info WHERE rollNumber = ?',
      [rollNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

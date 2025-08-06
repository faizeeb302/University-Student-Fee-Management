import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { rollNumber } = req.query;

  if (!rollNumber) {
    return res.status(400).json({ message: 'rollNumber is required' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM suspension WHERE rollNumber = ? ORDER BY fromDate DESC`,
      [rollNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No suspension records found' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching suspension data:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

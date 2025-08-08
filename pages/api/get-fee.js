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
    const query = `
      SELECT
        id,
        rollNumber,
        semester,
        challanId,
        amount,
        submissionDate,
        challanImageUrl
      FROM fees
      WHERE rollNumber = ?
      ORDER BY semester ASC
    `;

    const [rows] = await db.execute(query, [rollNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No fee records found for this roll number' });
    }

    res.status(200).json({ fees: rows });
  } catch (error) {
    console.error('Error fetching fee records:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

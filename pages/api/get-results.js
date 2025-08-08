import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { rollNumber, semester } = req.query;

  if (!rollNumber || !semester) {
    return res.status(400).json({ message: 'rollNumber and semester are required' });
  }

  try {
    const query = `
      SELECT subjectName, status
      FROM update_results
      WHERE rollNumber = ? AND semester = ?
      ORDER BY subjectName ASC
    `;

    const [results] = await db.execute(query, [rollNumber, semester]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for this student and semester' });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

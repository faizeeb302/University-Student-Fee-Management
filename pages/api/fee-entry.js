import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      rollNumber,
      semesterType,
      semesterYear,
      challanId,
      amount,
      submissionDate,
      challanImageUrl
    } = req.body;

    // Validate required fields
    if (
      !rollNumber ||
      !semesterType ||
      !semesterYear ||
      !challanId ||
      !amount ||
      !submissionDate
    ) {
      return res.status(400).json({ message: 'Missing required fee fields' });
    }

    // Insert query
    const query = `
      INSERT INTO fees (
        rollNumber,
        semesterType,
        semesterYear,
        challanId,
        amount,
        submissionDate,
        challanImageUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      rollNumber,
      semesterType,
      semesterYear,
      challanId,
      amount,
      submissionDate,
      challanImageUrl || null
    ];

    const [result] = await db.execute(query, values);

    res.status(200).json({
      message: 'Fee entry inserted successfully',
      feeId: result.insertId
    });
  } catch (error) {
    console.error('Error inserting fee entry:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

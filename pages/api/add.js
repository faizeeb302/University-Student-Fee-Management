import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      rollNumber,
      firstName,
      lastName,
      fatherName,
      department,
      degreeType,
      year,
      dateOfAdmission,
      email,
      phoneNumber,
      emergencyContact,
      gender,
      dateOfBirth,
      image,
      street,
      city,
      district,
      state,
      country,
      residenceType
    } = req.body;

    // Basic required field validation
    if (
      !rollNumber || !firstName || !lastName || !fatherName || !dateOfBirth ||
      !gender || !department || !degreeType || !year
    ) {
      return res.status(400).json({ message: 'Missing required student fields' });
    }


    const query = `
      INSERT INTO student_info (
        rollNumber,
        firstName,
        lastName,
        fatherName,
        dateOfBirth,
        gender,
        image,
        department,
        year,
        dateOfAdmission,
        degreeType,
        email,
        phoneNumber,
        emergencyContact,
        country,
        state,
        city,
        residenceType,
        district,
        street
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      rollNumber,
      firstName,
      lastName,
      fatherName,
      dateOfBirth,
      gender,
      image,
      department,
      year,
      dateOfAdmission,
      degreeType,
      email,
      phoneNumber,
      emergencyContact,
      country,
      state,
      city,
      residenceType,
      district,
      street
    ];

    const [result] = await db.execute(query, values);

    res.status(200).json({ message: 'Student inserted successfully', studentId: result.insertId });
  } catch (error) {
    console.error('Error inserting student:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

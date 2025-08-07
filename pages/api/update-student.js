import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      rollNumber, // required
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
      street,
      isSuspended
    } = req.body;

    if (!rollNumber) {
      return res.status(400).json({ message: 'rollNumber is required' });
    }

    // Build dynamic SET clause based on provided fields
    const fields = {
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
      street,
      isSuspended
    };

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    values.push(rollNumber); // for WHERE clause

    const query = `
      UPDATE student_info
      SET ${updates.join(', ')}
      WHERE rollNumber = ?
    `;

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}

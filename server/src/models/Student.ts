import pool from '../config/db.js';

export interface IStudent {
  id: string;
  name: string;
  class: string;
  contact: string;
  emailId?: string;
  address?: string;
  details?: string;
  dateOfBirth: string;      // Format: YYYY-MM-DD
  dateOfAdmission: string;  // Format: YYYY-MM-DD
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  imageUrl?: string;
  schoolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new student
export async function createStudent(student: IStudent): Promise<IStudent | null> {
  try {
    const [result]: any = await pool.execute(
      `INSERT INTO Student (
        id, name, class, contact, emailId, address, details, dateOfBirth, dateOfAdmission,
        fatherName, motherName, fatherPhone, motherPhone, imageUrl, schoolId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student.id,
        student.name,
        student.class,
        student.contact,
        student.emailId || null,
        student.address || null,
        student.details || null,
        student.dateOfBirth,
        student.dateOfAdmission,
        student.fatherName || null,
        student.motherName || null,
        student.fatherPhone || null,
        student.motherPhone || null,
        student.imageUrl || null,
        student.schoolId
      ]
    );
    return student;
  } catch (error) {
    console.error('Error inserting student:', error);
    return null; // Insert failed
  }
}


// Find student by id
export async function findStudentById(id:string): Promise<IStudent | null> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Student WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}
export async function checkStudentIdExists(id:string): Promise<boolean> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Student WHERE id = ? LIMIT 1',
    [id]
  );
  return !!rows[0];
}

export async function listStudentsBySchoolId(schoolId: string): Promise<IStudent[]> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Student WHERE schoolId = ?',
    [schoolId]
  );
  return rows as IStudent[];
}

export async function listStudents(): Promise<IStudent[]> {
  const [rows]: any = await pool.execute('SELECT * FROM Student');
  return rows as IStudent[];
}

// Update a student
export async function updateStudent(id:string, student: Partial<IStudent>): Promise<void> {
  const fields = [];
  const values = [];
  if (student.name !== undefined) { fields.push('name = ?'); values.push(student.name); }
  if (student.class !== undefined) { fields.push('class = ?'); values.push(student.class); }
  if (student.contact !== undefined) { fields.push('contact = ?'); values.push(student.contact); }
  if (student.emailId !== undefined) { fields.push('emailId = ?'); values.push(student.emailId); }
  if (student.address !== undefined) { fields.push('address = ?'); values.push(student.address); }
  if (student.details !== undefined) { fields.push('details = ?'); values.push(student.details); }
  if (student.dateOfBirth !== undefined) { fields.push('dateOfBirth = ?'); values.push(student.dateOfBirth); }
  if (student.dateOfAdmission !== undefined) { fields.push('dateOfAdmission = ?'); values.push(student.dateOfAdmission); }
  if (student.fatherName !== undefined) { fields.push('fatherName = ?'); values.push(student.fatherName); }
  if (student.motherName !== undefined) { fields.push('motherName = ?'); values.push(student.motherName); }
  if (student.fatherPhone !== undefined) { fields.push('fatherPhone = ?'); values.push(student.fatherPhone); }
  if (student.motherPhone !== undefined) { fields.push('motherPhone = ?'); values.push(student.motherPhone); }
  if (student.imageUrl !== undefined) { fields.push('imageUrl = ?'); values.push(student.imageUrl); }
  if (student.schoolId !== undefined) { fields.push('schoolId = ?'); values.push(student.schoolId); }
  values.push(id);

  if (fields.length === 0) return;

  await pool.execute(
    `UPDATE Student SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

// Delete a student
export async function deleteStudent(id:string): Promise<void> {
  await pool.execute('DELETE FROM Student WHERE id = ?', [id]);
}
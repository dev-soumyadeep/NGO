import pool from "../config/db";

export interface Alumni {
  id: string;
  name: string;
  class: string;
  contact: string;
  emailId?: string;
  address?: string;
  details?: string;
  dateOfBirth: string;
  dateOfAdmission: string;
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  imageUrl?: string;
  schoolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function addAlumni(alumni: Alumni): Promise<void> {
  const sql = `
    INSERT INTO Alumni (
      id, name, class, contact, emailId, address, details, dateOfBirth, dateOfAdmission,
      fatherName, motherName, fatherPhone, motherPhone, imageUrl, schoolId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [
    alumni.id,
    alumni.name,
    alumni.class,
    alumni.contact,
    alumni.emailId ?? null,
    alumni.address ?? null,
    alumni.details ?? null,
    alumni.dateOfBirth,
    alumni.dateOfAdmission,
    alumni.fatherName ?? null,
    alumni.motherName ?? null,
    alumni.fatherPhone ?? null,
    alumni.motherPhone ?? null,
    alumni.imageUrl ?? null,
    alumni.schoolId
  ]);  
}

export async function removeAlumni(id: string): Promise<void> {
  await pool.execute('DELETE FROM Alumni WHERE id = ?', [id]);
}

// Get alumni list
export async function getAlumniList(): Promise<Alumni[]> {
  const [rows] = await pool.query('SELECT * FROM Alumni');
  return rows as Alumni[];
}
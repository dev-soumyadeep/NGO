// src/models/School.ts
import pool from "../config/db";

export interface School {
  id: string;
  name: string;
  location: string;
  contactNumber: string;
  contactEmail: string;
  numberOfStudents: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new school
export async function createSchool(school: School): Promise<void> {
  const sql = `
    INSERT INTO School (id, name, location, contactNumber, contactEmail, numberOfStudents)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [
    school.id,
    school.name,
    school.location,
    school.contactNumber,
    school.contactEmail,
    school.numberOfStudents,
  ]);
}

// Get all schools
export async function getAllSchools(): Promise<School[]> {
  const [rows] = await pool.query('SELECT * FROM School');
  return rows as School[];
}

// Get a school by id
export async function getSchoolById(id:string): Promise<School | null> {
  const [rows] = await pool.query('SELECT * FROM School WHERE id = ?', [id]);
  const schools = rows as School[];
  return schools.length > 0 ? schools[0] : null;
}

// Delete a school by id
export async function deleteSchool(id:string): Promise<void> {
  await pool.execute('DELETE FROM School WHERE id = ?', [id]);
}
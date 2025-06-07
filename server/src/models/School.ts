// src/models/School.ts
import pool from "../config/db.js";

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
export async function updateNumberOfStudent(schoolId: string,action:string): Promise<void> {
  let operation :string
  if(action==='add')operation = 'numberOfStudents + 1';
  else operation = 'numberOfStudents - 1';
  const sql = `
    UPDATE School
    SET numberOfStudents = ${operation}
    where id=?
  `;
  await pool.execute(sql,[schoolId]);
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
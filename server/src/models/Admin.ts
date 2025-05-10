// src/models/Admin.ts
import pool from '../config/db';

// TypeScript interface for Admin (only required fields)
export interface IAdmin {
  email: string;
  password: string;
}

// Create a new admin
export async function createAdmin(email: string, password: string): Promise<void> {
  await pool.execute(
    'INSERT INTO Admin (email, password) VALUES (?, ?)',
    [email, password]
  );
}

// Find admin by email
export async function findAdminByEmail(email: string): Promise<IAdmin | null> {
  const [rows]: any = await pool.execute(
    'SELECT email, password FROM Admin WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}
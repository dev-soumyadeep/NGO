// src/controllers/adminAuthController.ts
import { Request, Response } from 'express';
import { findAdminByEmail,createAdmin,IAdmin } from '../models/Admin.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Use SQL-based function to find admin by email
    const admin: IAdmin | null = await findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Token setup (optional: put email in payload)
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    res.json({
      token,
      admin: {
        email: admin.email,
        role: 'admin'
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
      if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password are required' 
      });
    }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin in SQL DB
    await createAdmin(email, hashedPassword);

    res.status(201).json({
      message: 'Admin created successfully',
      email, 
    });
  } catch (error) {
    console.error('Add Admin Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
import { Request, Response } from 'express';
import { School } from '../models/School';

export const addSchool = async (req: Request, res: Response) => {
  const { name, location, contactNumber, contactEmail, numberOfStudents } = req.body;

  try {
    // Optional: check for duplicate school name or email if needed
    const existing = await School.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'School already exists' });
    }

    const newSchool = await School.create({
      name,
      location,
      contactNumber,
      contactEmail,
      numberOfStudents,
    });

    res.status(201).json({
      message: 'School added successfully',
      school: newSchool,
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const schools = await School.find(); // Fetch all schools from the database
    res.status(200).json({
      message: 'Schools fetched successfully',
      schools,
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSchoolById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const school = await School.findById(id); // Fetch school by ID
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({
      message: 'School fetched successfully',
      school,
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteSchool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate school ID
    if (!id) {
      return res.status(400).json({ success: false, message: 'School ID is required' });
    }

    // Find and delete the school
    const school = await School.findByIdAndDelete(id);

    if (!school) {
      return res.status(404).json({ success: false, message: 'School not found' });
    }

    return res.status(200).json({ success: true, message: 'School deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting school:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

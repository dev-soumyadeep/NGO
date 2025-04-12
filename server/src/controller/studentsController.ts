import { Request, Response } from 'express';
import { Student } from '../models/Student';

// Add a new student
export const addStudent = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const { name, contact, emailId, address, details } = req.body;

    if (!name || !contact) {
      return res.status(400).json({ success: false, message: 'Name and contact are required.' });
    }

    const student = new Student({
      name,
      contact,
      emailId,
      address,
      details,
      schoolId,
    });

    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get the list of students for a specific school
export const getStudentsBySchool = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;

    const students = await Student.find({ schoolId });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Remove a specific student
export const removeStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.status(200).json({ success: true, message: 'Student removed successfully.' });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete all students for a specific school (batch delete)
export const batchDeleteStudentsBySchool = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;

    const result = await Student.deleteMany({ schoolId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} students deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting students:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


// Count all students across all schools
export const countAllStudents = async (req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();
    res.status(200).json({ success: true, total: totalStudents });
  } catch (error) {
    console.error('Error counting students:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
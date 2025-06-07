import { Request, Response } from 'express';
import {
  IStudent,
  createStudent,
  findStudentById,
  listStudents,
  updateStudent,
  deleteStudent,
  checkStudentIdExists,
  listStudentsBySchoolId,
} from '../models/Student.ts';
import { updateNumberOfStudent } from '../models/School.ts';

function toMySQLDateFormat(dateStr: string): string {
  // Expects 'DD/MM/YYYY'
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const generateStudentId = () => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `STU-${year}${month}${day}${random}`;
};
// Add a new student
export const addStudent = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const {
      name,
      class: studentClass,
      contact,
      emailId,
      address,
      details,
      dateOfBirth,
      dateOfAdmission,
      fatherName,
      motherName,
      fatherPhone,
      motherPhone,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!name || !studentClass || !contact || !dateOfBirth || !dateOfAdmission || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Name, class, contact, date of birth, date of admission, and schoolId are required.',
      });
    }

    
    let id = generateStudentId();
    let response=await checkStudentIdExists(id);
    let limit=99;
    while(response && limit>0){
      id=generateStudentId();
      response= await checkStudentIdExists(id);
      limit--;
    }
    if(limit==0){
      return res.status(400).json({
        success: false,
        message: 'Cannot Admit new Student for Today, Please try again tomorrow',
      });
    }
    await updateNumberOfStudent(schoolId,"add");
    const student: IStudent = {
      id,
      name,
      class: studentClass,
      contact,
      emailId,
      address,
      details,
      dateOfBirth: toMySQLDateFormat(dateOfBirth),
      dateOfAdmission: toMySQLDateFormat(dateOfAdmission),
      fatherName,
      motherName,
      fatherPhone,
      motherPhone,
      imageUrl,
      schoolId:schoolId,
    };
    const createdStudent = await createStudent(student);
    res.status(200).json({ success: true, data: createdStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const getStudentsBySchool = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'schoolId is required.' });
    }
    const students = await listStudentsBySchoolId(schoolId);
    if(!students) {
      return res.status(404).json({ success: false, message: 'No students found for this school.' });
    }
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
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required.' });
    }

    const student = await findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await deleteStudent(studentId);
    updateNumberOfStudent(student.schoolId,"remove");
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
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'schoolId is required.' });
    }
    // Get all students for this school
    const students = await listStudentsBySchoolId(schoolId);
    const ids = students.map(s => s.id);
    let deletedCount = 0;
    for (const id of ids) {
      await deleteStudent(id!);
      deletedCount++;
    }
    res.status(200).json({
      success: true,
      message: `${deletedCount} students deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting students:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const countAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await listStudents();
    res.status(200).json({ success: true, total: students.length });
  } catch (error) {
    console.error('Error counting students:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


// Update student details
export const updateStudentDetails = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const updateFields = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required.' });
    }

    const student = await findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await updateStudent(studentId, updateFields);
    const updatedStudent = await findStudentById(studentId);

    res.status(200).json({ success: true, data: updatedStudent, message: 'Student details updated successfully.' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const findStudentByStudentId = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required.' });
    }
    const student = await findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const checkStudentIdExistsController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required.' });
    }
    const response = await checkStudentIdExists(studentId);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error finding student:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
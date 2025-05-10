import express from 'express';
import {
  addStudent,
  getStudentsBySchool,
  removeStudent,
  batchDeleteStudentsBySchool,
  checkStudentIdExistsController,
  countAllStudents,
  updateStudentDetails,
  findStudentByStudentId
} from '../controller/studentsController';
import { protect } from '../middleware/protect';

const router = express.Router();

router.post('/:schoolId/add',protect ,addStudent); // Add a new student
router.get('/:schoolId',protect ,getStudentsBySchool); // Get students by school
router.delete('/:studentId',protect ,removeStudent); // Remove a specific student
router.delete('/batch-delete/:schoolId',protect ,batchDeleteStudentsBySchool); // Batch delete students by school
router.get('/total',countAllStudents);
router.put('/update/:studentId', updateStudentDetails);
router.get('/exists/:studentId', checkStudentIdExistsController);
router.get('/get-student/:studentId', findStudentByStudentId);
export default router;
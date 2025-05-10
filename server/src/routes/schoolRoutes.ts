import express from 'express';
import { addSchool,getSchools,getSchoolByIdController,deleteSchoolController,getSchoolNameByIdController } from '../controller/schoolController';
import { protect } from '../middleware/protect';

const router = express.Router();

router.post('/add', protect, addSchool); // Only logged-in admin can add schools
router.get('/list', getSchools);
router.get('/:id', getSchoolByIdController);
router.get('/name/:id', getSchoolNameByIdController);
router.delete('/:id', protect, deleteSchoolController);
export default router;

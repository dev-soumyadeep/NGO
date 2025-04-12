import express from 'express';
import { addSchool,getSchools,getSchoolById,deleteSchool } from '../controller/schoolController';
import { protect } from '../middleware/protect';

const router = express.Router();

router.post('/add', protect, addSchool); // Only logged-in admin can add schools
router.get('/list', getSchools);
router.get('/:id', getSchoolById);
router.delete('/:id', protect, deleteSchool);
export default router;

import express from 'express';
import { createSchoolItemController  ,getSchoolItemsBySchoolIdController,updateSchoolItemStock} from '../controller/schoolItemController';

const schoolItemRoutes = express.Router();

schoolItemRoutes.post('/add', createSchoolItemController);
schoolItemRoutes.get('/:id', getSchoolItemsBySchoolIdController);
schoolItemRoutes.post('/update/:name', updateSchoolItemStock);
export default schoolItemRoutes;
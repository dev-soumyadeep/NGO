import express from 'express';
import { createSchoolItem,getSchoolItemsBySchoolId,updateSchoolItemStock} from '../controller/schoolItemController';

const schoolItemRoutes = express.Router();

schoolItemRoutes.post('/add', createSchoolItem);
schoolItemRoutes.get('/:id', getSchoolItemsBySchoolId);
schoolItemRoutes.post('/update/:id', updateSchoolItemStock);
export default schoolItemRoutes;
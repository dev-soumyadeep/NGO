import express from 'express';
import { addCategory, getCategoryList,getCategoryById,removeCategory } from '../controller/categoryController'
import { protect } from '../middleware/protect';

const categoryRoutes = express.Router();

// Route to add a new category (admin only)
categoryRoutes.post('/add', protect, addCategory);

// Route to fetch the list of categories (admin only)
categoryRoutes.get('/list',protect, getCategoryList);
categoryRoutes.get('/:id',protect, getCategoryById);
categoryRoutes.delete('/:id',protect,removeCategory);

export default categoryRoutes;


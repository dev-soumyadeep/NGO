import express from 'express';
import { addCategory, getCategoryListController,getCategoryByIdController,removeCategoryController } from '../controller/categoryController'
import { protect } from '../middleware/protect';

const categoryRoutes = express.Router();

// Route to add a new category (admin only)
categoryRoutes.post('/add', protect, addCategory);

// Route to fetch the list of categories (admin only)
categoryRoutes.get('/list',protect, getCategoryListController);
categoryRoutes.get('/:id',protect, getCategoryByIdController);
categoryRoutes.delete('/:id',protect,removeCategoryController);

export default categoryRoutes;


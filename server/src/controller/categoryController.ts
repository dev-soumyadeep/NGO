import { Request, Response } from 'express';
import {
  ICategory,
  createCategory,
  findCategoryByName,
  findCategoryById,
  updateCategory,
  listCategories,
  deleteCategory
} from '../models/Category';

// Add a new category
export const addCategory = async (req: Request, res: Response) => {
  try {
    const { id, name, description } = req.body;
    const existingCategory = await findCategoryByName(name);
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    const category: ICategory = {
      id,
      name,
      description,
    };
    const result = await createCategory(category);
    const fullCategory = await findCategoryById(id); // fetch from DB to get createdAt
    res.status(201).json({ success: result, data: fullCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'Failed to add category' });
  }
};

// Get category by ID
export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const category = await findCategoryById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

// Get all categories
export const getCategoryListController = async (req: Request, res: Response) => {
  try {
    const categories = await listCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

// Update a category
export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, description} = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    if (name === undefined && description === undefined) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const category = await findCategoryById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await updateCategory(id, { name, description});
    const updatedCategory = await findCategoryById(id);

    res.status(200).json({ success: true, data: updatedCategory, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

// Remove category by ID
export const removeCategoryController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const category = await findCategoryById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await deleteCategory(id);

    res.status(200).json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    console.error('Error removing category:', error);
    res.status(500).json({ success: false, message: 'Failed to remove category' });
  }
};

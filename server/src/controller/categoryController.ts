import { Request, Response } from 'express';
import { Category } from '../models/Category';

// Add a new category
export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    const category = new Category({
      name,
      description,
      totalInvestment: 0, 
    });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'Failed to add category' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Find the category by ID
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch category' });
    }
  };

export const getCategoryList = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const removeCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Find and delete the category by ID
      const category = await Category.findByIdAndDelete(id);
  
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      res.status(200).json({ success: true, message: 'Category removed successfully' });
    } catch (error) {
      console.error('Error removing category:', error);
      res.status(500).json({ success: false, message: 'Failed to remove category' });
    }
  };
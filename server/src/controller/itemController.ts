import { Request, Response } from 'express';
import { Item } from '../models/Item';
import { Category } from '../models/Category';

// Add a new item
export const addItem = async (req: Request, res: Response) => {
  try {
    const { name, description, quantity, price, category_id } = req.body;

    // Check if the category exists
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Create a new item
    const item = new Item({
      name,
      description,
      quantity,
      price,
      category_id,
    });

    await item.save();

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ success: false, message: 'Failed to add item' });
  }
};

export const getItemsByCategoryId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Check if the category exists
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Fetch all items under the given category
      const category_id=id
      const items = await Item.find({ category_id });
  
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      console.error('Error fetching items by category:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch items' });
    }
  };

  export const updateItemStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Item ID
      const { quantity, price } = req.body; // New quantity and price
  
      // Validate input
      if (quantity < 0 || price < 0) {
        return res.status(400).json({ success: false, message: 'Quantity and price must be non-negative values' });
      }
  
      // Find the item by ID
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
  
      // Update the item's quantity and price
      item.quantity = quantity;
      item.price = price;
      item.updatedAt = new Date(); // Update the `updatedAt` timestamp
  
      await item.save();
  
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      console.error('Error updating item stock:', error);
      res.status(500).json({ success: false, message: 'Failed to update item stock' });
    }
  };
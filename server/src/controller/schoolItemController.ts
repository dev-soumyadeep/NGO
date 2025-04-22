import { Request, Response } from 'express';
import SchoolItem from '../models/SchoolItem';

export const createSchoolItem = async (req: Request, res: Response) => {
    try {
      const { schoolId, itemId, quantity, price } = req.body;
      if (!schoolId || !itemId || !quantity || !price) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }
  
      // Try to find an existing SchoolItem for this school and item
      const existingSchoolItem = await SchoolItem.findOne({ schoolId, itemId });
  
      if (existingSchoolItem) {
        // Update the existing document's quantity and price
        existingSchoolItem.quantity += Number(quantity);
        existingSchoolItem.price += Number(price);
        await existingSchoolItem.save();
        return res.status(200).json({ success: true, data: existingSchoolItem, updated: true });
      } else {
        // Create a new document
        const newSchoolItem = await SchoolItem.create({
          schoolId,
          itemId,
          quantity,
          price,
        });
        return res.status(201).json({ success: true, data: newSchoolItem, created: true });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create or update SchoolItem', error });
    }
  };

export const getSchoolItemsBySchoolId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const schoolId = id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'schoolId is required.' });
      }
      const items = await SchoolItem.find({ schoolId }).populate('itemId'); // populate if you want item details
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch items', error });
    }
  };

  export const updateSchoolItemStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // This is itemId
      const { quantity, price } = req.body;
  
      if (!id || quantity === undefined || price === undefined) {
        return res.status(400).json({ success: false, message: 'itemId, quantity, and price are required.' });
      }
  
      // Update by itemId
      const updatedSchoolItem = await SchoolItem.findOneAndUpdate(
        { itemId: id },
        { quantity, price },
        { new: true }
      );
  
      if (!updatedSchoolItem) {
        return res.status(404).json({ success: false, message: 'SchoolItem not found.' });
      }
  
      res.status(200).json({ success: true, data: updatedSchoolItem });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update SchoolItem', error });
    }
  };
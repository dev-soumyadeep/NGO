import { Request, Response } from 'express';
import {
  SchoolItem,
  createSchoolItem,
  deleteSchoolItem,
  getSchoolItem,
  getSchoolItemByName,
  getSchoolItemsBySchoolId,
  updateSchoolItem
} from '../models/SchoolItem';

// Create or update a SchoolItem
export const createSchoolItemController = async (req: Request, res: Response) => {
  try {
    const { schoolId, itemId, name, quantity, price } = req.body;
    if (
      typeof schoolId !== 'string' ||
      typeof itemId !== 'string' ||
      typeof name !== 'string' ||
      typeof quantity !== 'number' ||
      typeof price !== 'number'
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required and must be numbers.' });
    }

    const existingSchoolItem = await getSchoolItemByName(name);
    if (existingSchoolItem) {
      const total_amount=Number(existingSchoolItem.total_amount)+price*quantity;
      const upgraded_price=parseFloat((total_amount/(Number(existingSchoolItem.quantity) + quantity)).toFixed(2));
      await updateSchoolItem(name, {
        quantity: existingSchoolItem.quantity + quantity,
        price: upgraded_price,
        total_amount:total_amount
      });
      const updatedSchoolItem = await getSchoolItemByName(name);
      return res.status(200).json({ success: true, data: updatedSchoolItem, updated: true });
    }else{
            const total_amount=quantity * price
            const newSchoolItem: SchoolItem = {
              schoolId,
              itemId,
              name,
              quantity,
              price,
              total_amount
            };
            await createSchoolItem(newSchoolItem);
            return res.status(201).json({ success: true, data: newSchoolItem, created: true });
  }
  } catch (error) {
    console.error('Error creating/updating SchoolItem:', error);
    res.status(500).json({ success: false, message: 'Failed to create or update SchoolItem', error });
  }
};


export const getSchoolItemsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId =req.params.id;
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'schoolId is required and must be a number.' });
    }
    const items = await getSchoolItemsBySchoolId(schoolId);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch items', error });
  }
};


export const updateSchoolItemStock = async (req: Request, res: Response) => {
  try {
    const {name} = req.params;
    const { quantity, price } = req.body;


    if (
      typeof name !== 'string' ||
      typeof Number(quantity) !== 'number' ||
      typeof Number(price) !== 'number'
    ) {
      return res.status(400).json({ success: false, message: 'name, quantity, and price are required and must be valied.' });
    }

    const existingSchoolItem = await getSchoolItemByName(name);
    if (!existingSchoolItem) {
      return res.status(404).json({ success: false, message: 'SchoolItem not found.' });
    }
    if(quantity===0){
      await deleteSchoolItem(existingSchoolItem.schoolId,existingSchoolItem.itemId);
      return res.status(200).json({success:true,message:"Item deleted because quantity reached zero."})
    }else{
      const total_amount = Number(quantity) * Number(price);
      await updateSchoolItem(name, { quantity, price, total_amount });
    const updatedSchoolItem = await getSchoolItemByName(name);
    res.status(200).json({ success: true, data: updatedSchoolItem });
    }
    
  } catch (error) {
    console.error('Error updating SchoolItem:', error);
    res.status(500).json({ success: false, message: 'Failed to update SchoolItem', error });
  }
};
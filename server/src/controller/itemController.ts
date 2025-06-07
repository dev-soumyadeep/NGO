import { Request, Response } from 'express';
import {
  createItem,
  findItemByName,
  findItemById,
  updateItem,
  deleteItem,
  listItems,
  IItem
} from '../models/Item';
import { findCategoryById } from '../models/Category'; 
export const addItem = async (req: Request, res: Response) => {
  try {
    const { id,name, description, quantity, price, category_id } = req.body;

    // Optional: Check if the category exists
    const Category = findCategoryById(category_id);
    if(!Category) return res.status(404).json({success:false,message:"Category Not Found"});

    // Check if item already exists by name
    const existingItem = await findItemByName(name);
    if (existingItem) {
      return res.status(409).json({ success: false, message: 'Item with this name already exists, Please update the item' });
    }
    const total_amount = quantity * price;
    const item: IItem = {
      id,
      name,
      description,
      quantity,
      price,
      total_amount,
      category_id,
    };
    const insertId = await createItem(item);
    const createdItem=await findItemById(insertId);
    res.status(201).json({ success: true, data: { ...createdItem, id: insertId } })
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ success: false, message: 'Failed to add item' });
  }
};

// export const getAllItems = async (req: Request, res: Response) => {
//   try {
//     const items = await listItems();
//     res.status(200).json({ success: true, data: items });
//   } catch (error) {
//     console.error('Error fetching items:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch items' });
//   }
// };


export const getItemByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const item = await findItemByName(name);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch item' });
  }
};

export const getItemsByCategoryId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Optional: check if category exists
    const Category = findCategoryById(id);
    if(!Category) return res.status(404).json({success:false,message:"Category Not Found"});
    // Filter items by category_id
    const items = (await listItems()).filter(item => String(item.category_id) === String(id));
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching items by category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch items' });
  }
};
export const updateItemStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantityChange, newprice,description } = req.body;
    // const quantity=o
    // Optionally recalculate total_amount
    const item = await findItemById(id);
    if(!item) return res.status(404).json({success:false,message:"Item Doesn't exist"})
    const quantity = item.quantity + quantityChange;
    if(quantity<0){
      return res.status(400).json({success:false,message:"Quantity can't be negative"})
    }
    else if(quantity===0){
      await deleteItem(id);
      return res.status(200).json({success:true,message:"Item deleted because quantity reached zero."})
    }
    else{
      const total_amount = Number(item.total_amount)+quantityChange*newprice;
      const oldquantity=Number(item.quantity);
      const newquantity=quantityChange;
      const new_price = parseFloat((total_amount/(newquantity+oldquantity)).toFixed(2));
      const updateData: any = { quantity, price:new_price, total_amount:total_amount };
      if (description !== undefined && description.trim() !== '') {
        updateData.description = description;
      }
      await updateItem(id, updateData);
      const updatedItem = await findItemById(id);
      res.status(200).json({ success: true, data: updatedItem });
    }
  } catch (error) {
    console.error('Error updating item stock:', error);
    res.status(500).json({ success: false, message: 'Failed to update item stock' });
  }
};

export const deleteItemStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await findItemById(id);
    if(!item) return res.status(404).json({success:false,message:"Item Doesn't exist"});
    await deleteItem(id);
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
};
 

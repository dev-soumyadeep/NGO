import express from 'express';
import { addItem,getItemsByCategoryId, updateItemStock,deleteItemStock} from '../controller/itemController';
import { protect } from '../middleware/protect';

const itemRoutes = express.Router();

// Route to add a new item (admin only)
itemRoutes.post('/add',protect, addItem);
itemRoutes.get('/category/:id',protect, getItemsByCategoryId);
itemRoutes.put('/update/:id',protect, updateItemStock);
itemRoutes.delete('/delete/:id',protect, deleteItemStock);
export default itemRoutes;
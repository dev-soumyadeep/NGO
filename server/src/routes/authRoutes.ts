// src/routes/adminAuth.ts
import express from 'express';
import { loginAdmin,addAdmin } from '../controller/adminAuthController';

const router = express.Router();

router.post('/login', loginAdmin); 
router.post('/add-admin', addAdmin);
export default router;

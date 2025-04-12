import express from 'express';
import { TransactionController } from '../controller/transactionController'
import { protect } from '../middleware/protect';
const router = express.Router();

router.post('/add', TransactionController.addTransaction);
router.get('/school/:schoolId', TransactionController.getTransactionsBySchool);
router.delete('/delete/:id', protect, TransactionController.deleteTransaction);
router.delete('/batch-delete/:schoolId', protect, TransactionController.batchTxDeleteBySchoolId);
export default router;
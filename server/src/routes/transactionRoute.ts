import express from 'express';
import { TransactionController } from '../controller/transactionController'
import { protect } from '../middleware/protect';
const router = express.Router();

router.post('/add', TransactionController.addTransaction);
router.get('/school/:schoolId', TransactionController.getTransactionsBySchool);
router.delete('/delete/:id', protect, TransactionController.deleteTransaction);
router.delete('/batch-delete/:schoolId', protect, TransactionController.batchTxDeleteBySchoolId);
router.get('/all', TransactionController.listAllTransactions);
router.get('/student/:studentId', TransactionController.getTransactionsByStudentId);
router.get('/central-summary', TransactionController.getCentralFinanceSummary);
router.post('/convert-student-id-to-alumni-id', TransactionController.convertStudentIdToAlumniIdController);
export default router;
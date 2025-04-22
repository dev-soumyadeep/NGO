import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';

export class TransactionController {
  static async addTransaction(req: Request, res: Response) {
    try {
      const { schoolId, studentId, type, category, amount, date, description } = req.body;

      // Validate required fields
      if (!schoolId || !type || !category || !amount || !date || !description) {
        return res.status(400).json({ success: false, message: 'All fields are required except studentId' });
      }

      // Create and save the transaction
      const transaction = new Transaction({
        schoolId,
        studentId, // Optional field
        type,
        category,
        amount,
        date: new Date(date),
        description,
      });

      await transaction.save();

      return res.status(201).json({ success: true, data: transaction });
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getTransactionsBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;

      // Validate schoolId
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID is required' });
      }

      // Fetch transactions for the given schoolId
      const transactions = await Transaction.find({ schoolId });

      return res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async deleteTransaction(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate transaction ID
      if (!id) {
        return res.status(400).json({ success: false, message: 'Transaction ID is required' });
      }

      // Find and delete the transaction
      const transaction = await Transaction.findByIdAndDelete(id);

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async batchTxDeleteBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;

      // Validate school ID
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID is required' });
      }

      // Delete all transactions for the given school ID
      const result = await Transaction.deleteMany({ schoolId });

      return res.status(200).json({
        success: true,
        message: `${result.deletedCount} transactions deleted successfully`,
      });
    } catch (error: any) {
      console.error('Error deleting transactions:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
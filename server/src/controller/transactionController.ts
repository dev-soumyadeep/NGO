import { Request, Response } from 'express';
import {
  ITransaction,
  createTransaction,
  findTransactionById,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  convertStudentIdToAlumniId
} from '../models/Transaction';
import {getSchoolById} from '../models/School';


export class TransactionController {
  static async addTransaction(req: Request, res: Response) {
    try {
      const {
        schoolId,
        studentId,
        type,
        category,
        itemName,
        amount,
        date,
        description,
        quantity,
        price
      } = req.body;

      // Validate required fields
      if (!type || !category || !amount || !date) {
        return res.status(400).json({
          success: false,
          message: 'type, category, amount, date are required.'
        });
      }

      // Optional: Validate quantity and price if provided
      if (quantity !== undefined && typeof quantity !== 'number') {
        return res.status(400).json({ success: false, message: 'quantity must be a number.' });
      }
      if (price !== undefined && typeof price !== 'number') {
        return res.status(400).json({ success: false, message: 'price must be a number.' });
      }

      let schoolName: string | undefined = undefined;
      if (schoolId) {
        try {
          const school = await getSchoolById(schoolId);
          if (school && school.name) {
            schoolName = school.name;
          }
        } catch (error) {
          // Optionally log or handle error, but don't block transaction creation
          console.error('Error fetching school by ID:', error);
        }
      }
      const id=Date.now().toString();
      const transaction: ITransaction = {
        id,
        date,
        type : type ? type : undefined,
        category : category ? category : undefined,
        itemName : itemName ? itemName : undefined,
        amount,
        description : description ? description : undefined,
        schoolId: schoolId ? schoolId : undefined,
        studentId: studentId ? studentId : undefined,
        schoolName : schoolName ? schoolName : undefined,
        quantity: quantity !== undefined ? quantity : undefined,
        price: price !== undefined ? price : undefined,
      };

      const createdTx = await createTransaction(transaction);
      return res.status(201).json({ success: true, data: createdTx });
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      return res.status(500).json({ success: false, message: 'Failed to add transaction', error: error.message });
    }
  }


  static async getTransactionsBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
  
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID is required' });
      }
  
      const transactions = await listTransactions({ schoolId: schoolId });
  
      const toNumber2 = (value: any): number => Number(parseFloat(value).toFixed(2)) || 0;
  
      const totalIncome: number = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + toNumber2(tx.amount), 0);
  
      const totalExpense: number = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + toNumber2(tx.amount), 0);
  
      const netBalance: number = totalIncome - totalExpense;
      const round2 = (n: number) => n.toFixed(2);
      return res.status(200).json({
        success: true,
        transactions: transactions,
        netBalance: round2(netBalance),
        totalIncome: round2(totalIncome),
        totalExpense: round2(totalExpense),
      });
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete a transaction by id
  static async deleteTransaction(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Transaction ID is required' });
      }

      const transaction = await findTransactionById(id);

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      await deleteTransaction(id);
      return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Batch delete transactions by schoolId
  static async batchTxDeleteBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID is required' });
      }

      const transactions = await listTransactions({ schoolId:schoolId });
      const ids = transactions.map(tx => tx.id);
      let deletedCount = 0;
      for (const id of ids) {
        await deleteTransaction(id!);
        deletedCount++;
      }

      return res.status(200).json({
        success: true,
        message: `${deletedCount} transactions deleted successfully`,
      });
    } catch (error: any) {
      console.error('Error deleting transactions:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getTransactionsByStudentId(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID is required' });
      }
      const transactions = await listTransactions({ studentId });
      return res.status(200).json({ success: true, data: transactions });
    } catch (error: any) {
      console.error('Error fetching transactions by studentId:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }


  static async listAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await listTransactions();
      return res.status(200).json({ success: true, data: transactions });
    } catch (error: any) {
      console.error('Error fetching all transactions:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getCentralFinanceSummary(req: Request, res: Response) {
    try {
      const transactions = await listTransactions();
  
      const toNumber2 = (value: any): number => Number(parseFloat(value).toFixed(2)) || 0;
      const totalIncome:number = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + toNumber2(tx.amount), 0);
  
      const totalExpense:number = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + toNumber2(tx.amount), 0);
  
      const netBalance:number = totalIncome - totalExpense;
      const round2 = (n: number) => n.toFixed(2);
      return res.status(200).json({
        netBalance: round2(netBalance),
        totalIncome: round2(totalIncome),
        totalExpense: round2(totalExpense),
      });
    } catch (error) {
      console.error('Error fetching finance summary:', error);
      return res.status(500).json({ message: 'Failed to fetch summary' });
    }
  }

  static async convertStudentIdToAlumniIdController(req: Request, res: Response) {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }
    try {
      await convertStudentIdToAlumniId(studentId);
      res.status(200).json({ success: true, message: 'StudentId successfully converted to AlumniId in transactions.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to convert studentId to alumniId', error });
    }
  }

}





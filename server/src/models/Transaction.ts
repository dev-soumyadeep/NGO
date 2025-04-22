import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  schoolId: string;
  studentId?: string; // Optional, as not all transactions may be linked to a student
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description: string;
}

const TransactionSchema: Schema = new Schema(
  {
    schoolId: { type: String, required: true },
    studentId: { type: String },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
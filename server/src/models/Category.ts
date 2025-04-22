import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt?: string;
  totalInvestment?: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    totalInvestment: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
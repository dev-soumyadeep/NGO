import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category_id: mongoose.Types.ObjectId; // Reference to the Category model
  createdAt?: Date;
  updatedAt?: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Foreign key reference
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Item = mongoose.model<IItem>('Item', ItemSchema);
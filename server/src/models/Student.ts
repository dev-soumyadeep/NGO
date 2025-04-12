import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string; // Mandatory
  contact: string; // Mandatory
  emailId?: string; // Optional
  address?: string; // Optional
  details?: string; // Optional
  schoolId: mongoose.Types.ObjectId; // Reference to the School
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    emailId: { type: String },
    address: { type: String },
    details: { type: String },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true }, // Reference to School
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
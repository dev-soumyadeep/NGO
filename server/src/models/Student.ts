import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string; // Mandatory
  class: string; // Mandatory
  contact: string; // Mandatory
  emailId?: string; // Optional
  address?: string; // Optional
  details?: string; // Optional
  dateOfBirth: string; // Mandatory, format: YYYY-MM-DD
  dateOfAdmission: string; // Mandatory, format: YYYY-MM-DD
  fatherName?: string; // Optional
  motherName?: string; // Optional
  fatherPhone?: string; // Optional
  motherPhone?: string; // Optional
  imageUrl?: string; // Optional, URL for the student's image
  schoolId: mongoose.Types.ObjectId; // Reference to the School
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    contact: { type: String, required: true },
    emailId: { type: String },
    address: { type: String },
    details: { type: String },
    dateOfBirth: { type: String, required: true }, // Format: YYYY-MM-DD
    dateOfAdmission: { type: String, required: true }, // Format: YYYY-MM-DD
    fatherName: { type: String },
    motherName: { type: String },
    fatherPhone: { type: String },
    motherPhone: { type: String },
    imageUrl: { type: String }, // Optional, URL for the student's image
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true }, // Reference to School
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
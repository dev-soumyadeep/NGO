import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  location: string;
  contactNumber: string;
  contactEmail: string;
  numberOfStudents: number;
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    contactEmail: { type: String, required: true },
    numberOfStudents: { type: Number, required: true },
  },
  { timestamps: true }
);

export const School = mongoose.model<ISchool>('School', SchoolSchema);

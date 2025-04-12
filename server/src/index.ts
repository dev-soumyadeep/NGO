import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import schoolRoutes from './routes/schoolRoutes';
import transactionRoutes from './routes/transactionRoute';
import studentRoutes from './routes/studentsRoutes'
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'NGO Server API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/school',schoolRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/student', studentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
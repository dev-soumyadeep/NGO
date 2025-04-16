import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https'; // Import https for pinging the server
import authRoutes from './routes/authRoutes';
import schoolRoutes from './routes/schoolRoutes';
import transactionRoutes from './routes/transactionRoute';
import studentRoutes from './routes/studentsRoutes';

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
app.use('/api/school', schoolRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/student', studentRoutes);

// Ping server function
const pingServer = () => {
  const url = process.env.RENDER_SERVER_URL || 'https://ngo-myd7.onrender.com/'; 
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log(`[${new Date().toISOString()}] Server pinged successfully.`);
    } else {
      console.error(
        `[${new Date().toISOString()}] Server ping failed with status code: ${res.statusCode}`
      );
    }
  }).on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Error pinging server:`, error.message);
  });
};

// Start the interval to ping the server every 14 minutes and 58 seconds
const INTERVAL = 14 * 60 * 1000 + 58 * 1000; // 14 minutes and 58 seconds in milliseconds
setInterval(pingServer, INTERVAL);

// Optional: Ping the server immediately when the application starts
pingServer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
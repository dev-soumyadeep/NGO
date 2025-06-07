import axios from 'axios';
import { Transaction, SchoolFinancial } from '@/types';
import { getSchool } from './schoolService';

// const API_BASE_URL = `http://localhost:5000/api/transaction`; 
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/transaction`; 

export const getIncomeCategories = () => [
  { id: 'tuition_fees', name: 'Tuition Fees', type: 'income' },
  { id: 'admission_fees', name: 'Admission Fees', type: 'income' },
  { id: 'session_fees', name: 'Session Fees', type: 'income' },
  { id: 'caution_deposit', name: 'Caution Deposit', type: 'income' },
  { id: 'stationary', name: 'Stationary', type: 'income' },
  { id: 'transport', name: 'Transport', type: 'income' },
  { id: 'donations', name: 'Donations', type: 'income' },
  { id: 'other_income', name: 'Other Income', type: 'income' }
];

export const getExpenseCategories = () => [
  { id: 'books', name: 'Books', type: 'expense' },
  { id: 'stationary', name: 'Stationary', type: 'expense' },
  { id: 'consumables', name: 'Consumables', type: 'expense' },
  { id: 'educational_tools', name: 'Educational Tools', type: 'expense' }, 
  { id: 'other_expense', name: 'Other Expenses', type: 'expense' }
];

export const getSchoolFinancials = async (schoolId: string): Promise<SchoolFinancial> => {
  try {
    const school = await getSchool(schoolId);

    // Fetch transactions for the school
    const response = await axios.get(`${API_BASE_URL}/school/${schoolId}`);
    const schoolTransactions: { netBalance: number; totalIncome: number; totalExpense: number; transactions: Transaction[] } = response.data;
    console.log(schoolTransactions);
    return {
      school,
      netBalance:schoolTransactions.netBalance,
      totalIncome:schoolTransactions.totalIncome,
      totalExpense:schoolTransactions.totalExpense,
      transactions: schoolTransactions.transactions
    };
  } catch (error) {
    console.error('Error fetching school financials:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch school financials');
  }
};

export const addTransaction = async (
  transaction: Omit<Transaction, 'createdAt' | 'updatedAt'>,
  token: string
): Promise<Transaction> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/add`,
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );
    return response.data.data; // Assuming the backend returns { success: true, data: {...} }
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error(error.response?.data?.message || 'Failed to add transaction');
  }
};


export const deleteTransaction = async (transactionId: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/delete/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete transaction');
  }
};


// export const batchDeleteTransactionsBySchoolId = async (schoolId: string, token: string): Promise<void> => {
//   try {
//     await axios.delete(`${API_BASE_URL}/batch-delete/${schoolId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include the token in the Authorization header
//       },
//     });
//   } catch (error) {
//     console.error('Error deleting transactions in batch:', error);
//     throw new Error(error.response?.data?.message || 'Failed to delete transactions in batch');
//   }
// };

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data.data;
};

// Get transactions by schoolId
export const getTransactionsBySchoolId = async (schoolId: string): Promise<Transaction[]> => {
  const response = await axios.get(`${API_BASE_URL}/school/${schoolId}`);
  return response.data.data;
};

// Get transactions by studentId
export const getTransactionsByStudentId = async (studentId: string): Promise<Transaction[]> => {
  const response = await axios.get(`${API_BASE_URL}/student/${studentId}`);
  return response.data.data;
};

// Get central finance summary (netBalance, totalIncome, totalExpense)
export const getCentralFinanceSummary = async (): Promise<{ netBalance: number; totalIncome: number; totalExpense: number }> => {
  const response = await axios.get(`${API_BASE_URL}/central-summary`);
  return response.data;
};

// Get school finance summary (netBalance, totalIncome, totalExpense, schoolName) by schoolId
export const getSchoolFinanceSummary = async (
  schoolId: string
): Promise<{
  netBalance:number;
  totalIncome: number;
  totalExpense: number;
}> => {
  const response = await axios.get(`${API_BASE_URL}/school-summary/${schoolId}`);
  return response.data;
};



export const convertStudentIdToAlumniId = async (studentId: string, token: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/convert-student-id-to-alumni-id`, { studentId }, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
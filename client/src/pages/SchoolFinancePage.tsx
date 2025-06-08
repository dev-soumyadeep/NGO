import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SchoolFinancial } from '@/types';
import { getSchoolFinancials } from '@/api/financialService';
import Navbar from '@/components/Navbar';
import TransactionList from '@/components/TransactionList';
import AddTransactionForm from '@/components/AddTransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { FileDown } from 'lucide-react';

// autoTable(jsPDF,{});
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options) => jsPDF;
  }
}
const SchoolFinancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const navigate = useNavigate();
  const [financial, setFinancial] = useState<SchoolFinancial | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const date = new Date();
  
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (!id) {
      navigate('/finance');
      return;
    }

    const fetchFinancials = async () => {
      try {
        setLoading(true);
        const data = await getSchoolFinancials(id);
        setFinancial(data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, [id, state.isAuthenticated, state.user, navigate, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`${financial.school.name} - Financial Report`, 14, 15);

  doc.setFontSize(12);
  doc.text(`School Location: ${financial.school.location}`, 14, 25);
  doc.text(`Net Balance: ${financial.netBalance}rs`, 14, 32);
  doc.text(`Total Income: ${financial.totalIncome}rs`, 14, 39);
  doc.text(`Total Expenses: ${financial.totalExpense}rs`, 14, 46);

  const tableData = sortedTransactions.map(tx => [
    new Date(tx.date).toLocaleDateString(),
    tx.type,
    tx.category,
    tx.studentId || '-',
    tx.itemName || '-',
    tx.quantity || '-',
    tx.price || '-',
    `${tx.amount}`,
    tx.description || '-',
    new Date(tx.createdAt).toLocaleTimeString()
  ]);

  autoTable(doc,{
    head: [['Date', 'Type', 'Category', 'Student ID', 'Item', 'Qty', 'Price(rs)', 'Amount(rs)', 'Description', 'Time']],
    body: tableData,
    startY: 53,
    theme: 'grid'
  });
  
  doc.save(`${financial.school.name}_transactions_${date}.pdf`);
};


const csvHeaders = [
  { label: 'Date', key: 'date' },
  { label: 'Type', key: 'type' },
  { label: 'Category', key: 'category' },
  { label: 'Student ID', key: 'studentId' },
  { label: 'Item Name', key: 'itemName' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Price', key: 'price' },
  { label: 'Amount', key: 'amount' },
  { label: 'Description', key: 'description' },
  { label: 'Time', key: 'createdAt' }
];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
        </div>
      </div>
    );
  }

  if (!financial) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">School not found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The school you are looking for does not exist or you do not have permission to view it.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/finance')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Finance
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Sort and filter transactions
  const sortedTransactions = [...financial.transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  const incomeTransactions = sortedTransactions.filter((tx) => tx.type === 'income');
  const expenseTransactions = sortedTransactions.filter((tx) => tx.type === 'expense');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/finance')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-brand-indigo">{financial.school.name}</h1>
            </div>
            <p className="text-gray-600 mt-1">{financial.school.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white overflow-hidden">
            <CardHeader className="bg-brand-blue text-white p-4">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p
                className={`text-2xl font-bold ${
                  financial.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ₹{financial.netBalance.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white overflow-hidden">
            <CardHeader className="bg-green-100 p-4">
              <CardTitle className="text-lg flex items-center text-green-800">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-green-600">
                ₹{financial.totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white overflow-hidden">
            <CardHeader className="bg-red-100 p-4">
              <CardTitle className="text-lg flex items-center text-red-800">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-red-600">
                ₹{financial.totalExpense.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <AddTransactionForm schoolIdInSchoolFinance={financial.school.id} onTransactionAdded={handleRefresh} />
          </div>
          <div className='col-span-1 lg:col-span-2 flex flex-col gap-4'>
            <div className='flex justify-end gap-2'>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
              
              <CSVLink
                data={sortedTransactions}
                headers={csvHeaders}
                filename={`${financial.school.name}_transactions_${date}.csv`}
                className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </CSVLink>
            </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <TransactionList
                    transactions={sortedTransactions}
                    type="all"
                    title="All Transactions"
                  />
                </TabsContent>

                <TabsContent value="income">
                  <TransactionList
                    transactions={incomeTransactions}
                    type="income"
                    title="Income Transactions"
                  />
                </TabsContent>

                <TabsContent value="expense">
                  <TransactionList
                    transactions={expenseTransactions}
                    type="expense"
                    title="Expense Transactions"
                  />
                </TabsContent>
              </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolFinancePage;

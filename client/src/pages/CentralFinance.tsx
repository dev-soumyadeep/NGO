import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Transaction } from '@/types';
import { getAllTransactions, getCentralFinanceSummary } from '@/api/financialService';
import Navbar from '@/components/Navbar';
import AddTransactionForm from '@/components/AddTransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { deleteTransaction } from '@/api/financialService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@/components/ui/dialog';
import { FileDown } from 'lucide-react'; 
import jsPDF from 'jspdf';
import { UserOptions } from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
const CentralFinance: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ netBalance: 0, totalIncome: 0, totalExpense: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { toast } = useToast();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [txs, summaryData] = await Promise.all([
          getAllTransactions(),
          getCentralFinanceSummary()
        ]);
        setTransactions(txs);
        setSummary(summaryData || { netBalance: 0, totalIncome: 0, totalExpense: 0 });
      } catch (error) {
        setTransactions([]);
        setSummary({ netBalance: 0, totalIncome: 0, totalExpense: 0 });
      }
      setLoading(false);
    };

    fetchData();
  }, [state.isAuthenticated, state.user, navigate, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // Sorting and filtering
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const incomeTransactions = sortedTransactions.filter((tx) => tx.type === 'income');
  const expenseTransactions = sortedTransactions.filter((tx) => tx.type === 'expense');


  function formatDateTime(dateStr?: string | Date, format?: string) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    if (format === 'date') return `${day}-${month}-${year}`;
    else return `${hours}:${minutes}:${seconds}`;
  }

  
  const openDeleteDialog = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteTransaction(selectedId, state.token || '');
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
      setOpenDialog(false);
      setSelectedId(null);
      handleRefresh();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
      setOpenDialog(false);
    }
  };

  const downloadPDF = () => {
  const doc = new jsPDF() as jsPDFCustom;
  
  // Add title
  doc.setFontSize(16);
  doc.text('Financial Transactions Report', 14, 15);
  
  // Add summary
  doc.setFontSize(12);
  doc.text(`Net Balance: ₹${summary.netBalance}`, 14, 25);
  doc.text(`Total Income: ₹${summary.totalIncome}`, 14, 32);
  doc.text(`Total Expenses: ₹${summary.totalExpense}`, 14, 39);
  
  // Convert transactions to table format
  const tableData = transactions.map(tx => [
    formatDateTime(tx.date, 'date'),
    tx.type,
    tx.category,
    tx.schoolName || '-',
    tx.studentId || '-',
    tx.itemName || '-',
    tx.quantity || '-',
    tx.price || '-',
    tx.amount,
    tx.description || '-',
    formatDateTime(tx.createdAt, 'time')
  ]);

  // Add table


doc.autoTable({
  head: [['Date', 'Type', 'Category', 'School', 'Student ID', 'Item', 'Qty', 'Price', 'Amount', 'Description', 'Time']],
  body: tableData,
  startY: 45,
});

  doc.save('transactions.pdf');
};

const csvHeaders = [
  { label: 'Date', key: 'date' },
  { label: 'Type', key: 'type' },
  { label: 'Category', key: 'category' },
  { label: 'School Name', key: 'schoolName' },
  { label: 'Student ID', key: 'studentId' },
  { label: 'Item Name', key: 'itemName' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Price', key: 'price' },
  { label: 'Amount', key: 'amount' },
  { label: 'Description', key: 'description' },
  { label: 'Time', key: 'createdAt' }
];

  // Render transaction table
  const renderTxTable = (txs: Transaction[]) => (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Category</th>
            <th className="p-2">School Name</th>
            <th className="p-2">Student ID</th>
            <th className="p-2">Item Name</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Price</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Description</th>
            <th className="p-2">Time</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {txs.length === 0 ? (
            <tr>
              <td colSpan={13} className="text-center py-4 text-gray-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            txs.map((tx) => (
                <tr key={tx.id} className="border-b">
                <td className="p-2">{formatDateTime(tx.date,"date")}</td>
                <td className="p-2">{tx.type}</td>
                <td className="p-2">{tx.category}</td>
                <td className="p-2">{tx.schoolName || '-'}</td>
                <td className="p-2">{tx.studentId || '-'}</td>
                <td className="p-2">{tx.itemName || '-'}</td>
                <td className="p-2">{tx.quantity ?? '-'}</td>
                <td className="p-2">{tx.price ?? '-'}</td>
                <td className="p-2">{tx.amount}</td>
                <td className="p-2">{tx.description || '-'}</td>
                <td className="p-2">{formatDateTime(tx.createdAt,"time")}</td>
                <td className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(tx.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white overflow-hidden">
            <CardHeader className="bg-brand-blue text-white p-4">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(summary.netBalance ?? 0).toLocaleString()}
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
                ₹{(summary.totalIncome ?? 0).toLocaleString()}
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
                ₹{(summary.totalExpense ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Two-column layout: form on left, table on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          <div>
            <AddTransactionForm schoolIdInSchoolFinance={null} onTransactionAdded={handleRefresh} />
          </div>
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
              <div className="flex justify-end gap-2 mb-4">
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
                data={transactions}
                headers={csvHeaders}
                filename="transactions.csv"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </CSVLink>
            </div>
              <TabsContent value="all">
                <div className="w-full">{renderTxTable(sortedTransactions)}</div>
              </TabsContent>
              <TabsContent value="income">
                <div className="w-full">{renderTxTable(incomeTransactions)}</div>
              </TabsContent>
              <TabsContent value="expense">
                <div className="w-full">{renderTxTable(expenseTransactions)}</div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this transaction?</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
  );
};

export default CentralFinance;
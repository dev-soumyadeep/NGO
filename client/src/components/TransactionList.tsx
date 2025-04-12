import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteTransaction } from '@/api/financialService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';


interface TransactionListProps {
  transactions: Transaction[];
  type: 'income' | 'expense' | 'all';
  title: string;
  onTransactionDeleted: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  type,
  title,
  onTransactionDeleted
}) => {
  const { state } = useAuth();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredTransactions =
    type === 'all'
      ? transactions
      : transactions.filter((t) => t.type === type);

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      onTransactionDeleted();
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

  // Function to generate PDF
  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
  
    const doc = new jsPDF();
  
    // Add the title
    doc.text(title, 14, 10);
  
    // Calculate totals
    const totalIncome = sortedTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  
    const totalExpense = sortedTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  
    const netBalance = totalIncome - totalExpense;
  
    // Add the main table
    autoTable(doc, {
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: sortedTransactions.map((transaction) => [
        format(new Date(transaction.date), 'MMM dd, yyyy'), // Format the date
        transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1), // Capitalize type
        transaction.category.replace('_', ' '), // Replace underscores in category
        transaction.description || '-', // Handle empty descriptions
        `${transaction.amount.toLocaleString()}`, // Ensure amount is properly formatted
      ]),
    });
  
    // Add totals at the end of the PDF
    autoTable(doc, {
      body: [
        ['Total Income', '', '', '', `${totalIncome.toLocaleString()}`],
        ['Total Expense', '', '', '', `${totalExpense.toLocaleString()}`],
        ['Net Balance', '', '', '', `${netBalance.toLocaleString()}`],
      ],
      theme: 'plain', // Use a plain theme for the totals
      styles: { fontStyle: 'bold' }, // Make the totals bold
      margin: { top: 10 }, // Add some margin above the totals
    });
  
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  // Prepare data for CSV
  const csvData = sortedTransactions.map((transaction) => ({
    Date: format(new Date(transaction.date), 'MMM dd, yyyy'),
    Type: transaction.type,
    Category: transaction.category,
    Description: transaction.description,
    Amount: transaction.amount,
  }));

  return (
    <>
      <Card>
        <CardHeader
          className={`${
            type === 'income'
              ? 'bg-green-100'
              : type === 'expense'
              ? 'bg-red-100'
              : 'bg-gray-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                Download PDF
              </Button>
              <CSVLink
                data={csvData}
                filename={`${title.replace(/\s+/g, '_').toLowerCase()}.csv`}
                className="btn btn-outline btn-sm"
              >
                <Button variant="outline" size="sm">
                  Download CSV
                </Button>
              </CSVLink>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sortedTransactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions to display
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {type === 'all' && <TableHead>Type</TableHead>}
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>

                    {type === 'all' && (
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === 'income' ? (
                            <>
                              <ArrowDownCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600">Income</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-600">Expense</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="capitalize">
                      {transaction.category.replace('_', ' ')}
                    </TableCell>

                    <TableCell>{transaction.description}</TableCell>

                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}₹
                      {transaction.amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(transaction._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
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
    </>
  );
};

export default TransactionList;

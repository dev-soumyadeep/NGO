import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FiSearch } from 'react-icons/fi'; 
interface TransactionListProps {
  transactions: Transaction[];
  type: 'income' | 'expense' | 'all';
  title: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  type,
  title
}) => {

  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  const filteredTransactions =
    type === 'all'
      ? transactions
      : transactions.filter((t) => t.type === type);

  // Updated search logic
  const searchedTransactions =
    searchQuery.trim() === '' // If search query is empty, show all transactions
      ? filteredTransactions
      : filteredTransactions.filter((transaction) =>
          transaction.studentId
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

  const sortedTransactions = [...searchedTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Search Bar */}
          <div className="mb-6">
          <div className="flex items-center space-x-2">
            <FiSearch className="text-gray-500 w-5 h-5" /> {/* Magnifying glass icon */}
            <h2 className="text-lg font-semibold text-gray-700">Search Transactions by Student-ID</h2>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="text"
              placeholder="Enter Student ID to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-brand-indigo focus:ring-2 focus:ring-brand-indigo focus:outline-none rounded-lg p-2 w-full"
            />
          </div>
        </div>


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
                  <TableHead>Student ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
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

                    <TableCell>
                      {transaction.studentId || '-'} {/* Display studentId or a dash if not present */}
                    </TableCell>

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
                    <TableCell className="p-2">{formatDateTime(transaction.createdAt,"time")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionList;
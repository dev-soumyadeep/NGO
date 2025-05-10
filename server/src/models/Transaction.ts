import pool from '../config/db';

export interface ITransaction {
  id?: string;
  date: string; // Format: YYYY-MM-DD or ISO string
  type: 'income' | 'expense';
  category: string;
  schoolId?: string;
  schoolName?: string;
  studentId?: string;
  itemName?: string;
  quantity?: number;
  price?: number;
  amount: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new transaction
export async function createTransaction(transaction: ITransaction): Promise<ITransaction | null> {
  const [result]: any = await pool.execute(
    `INSERT INTO Transaction (
        id, date, type, category, schoolName, schoolId, studentId, itemName, quantity, price, amount, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.id,
      transaction.date,
      transaction.type,
      transaction.category,
      transaction.schoolName || null,
      transaction.schoolId || null,
      transaction.studentId || null,
      transaction.itemName || null,
      transaction.quantity ?? null,
      transaction.price ?? null,
      transaction.amount,
      transaction.description || null,
    ]
  );
  return transaction;
}

// Find transaction by id
export async function findTransactionById(id: string): Promise<ITransaction | null> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Transaction WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

export async function listTransactions(filter?: { schoolId?: string; studentId?: string }): Promise<ITransaction[]> {
  let query = 'SELECT * FROM Transaction';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.schoolId) {
    conditions.push('schoolId = ?');
    params.push(filter.schoolId);
  }

  if (filter?.studentId) {
    conditions.push('studentId = ?');
    params.push(filter.studentId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY createdAt DESC';

  const [rows]: any = await pool.execute(query, params);
  return rows;
}


// Update a transaction
export async function updateTransaction(id: string, transaction: Partial<ITransaction>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (transaction.date !== undefined) { fields.push('date = ?'); values.push(transaction.date); }
  if (transaction.type !== undefined) { fields.push('type = ?'); values.push(transaction.type); }
  if (transaction.category !== undefined) { fields.push('category = ?'); values.push(transaction.category); }
  if (transaction.schoolName !== undefined) { fields.push('schoolName = ?'); values.push(transaction.schoolName); }
  if (transaction.schoolId !== undefined) { fields.push('schoolId = ?'); values.push(transaction.schoolId); }
  if (transaction.studentId !== undefined) { fields.push('studentId = ?'); values.push(transaction.studentId); }
  if(transaction.itemName!==undefined){fields.push('itemName = ?'); values.push(transaction.itemName);}
  if (transaction.amount !== undefined) { fields.push('amount = ?'); values.push(transaction.amount); }
  if (transaction.description !== undefined) { fields.push('description = ?'); values.push(transaction.description); }

  if (fields.length === 0) return; // Nothing to update

  values.push(id);

  await pool.execute(
    `UPDATE Transaction SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<void> {
  await pool.execute('DELETE FROM Transaction WHERE id = ?', [id]);
}

// Update all transactions for a specific studentId to the corresponding alumniId
export async function convertStudentIdToAlumniId(studentId: string): Promise<void> {
  if (!studentId.startsWith('STU-')) {
    throw new Error('Provided studentId does not start with "STU-"');
  }
  const alumniId = studentId.replace(/^STU-/, 'ALU-');
  await pool.execute(
    'UPDATE Transaction SET studentId = ? WHERE studentId = ?',
    [alumniId, studentId]
  );
}

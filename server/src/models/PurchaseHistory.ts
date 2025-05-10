import pool from "../config/db";

export interface PurchaseHistory {
  date: Date;
  schoolId: string;
  studentId: string;
  itemName: string;
  quantity: number;
}

// ✅ Get purchase histories by studentId
export async function getPurchaseHistoriesByStudentId(studentId: string): Promise<PurchaseHistory[]> {
  const [rows] = await pool.query(
    'SELECT * FROM PurchaseHistory WHERE studentId = ?',
    [studentId]
  );
  return rows as PurchaseHistory[];
}

interface PurchaseHistoryFilters {
  startDate?: string;
  endDate?: string;
  studentId?: string;
  itemName?: string;
  schoolId?: string;
}

export async function getFilteredPurchaseHistory(filters: PurchaseHistoryFilters): Promise<PurchaseHistory[]> {
  let query = 'SELECT * FROM PurchaseHistory WHERE 1=1';
  const params: any[] = [];

  if (filters.startDate && filters.endDate) {
    query += ' AND date BETWEEN ? AND ?';
    params.push(filters.startDate, filters.endDate);
  } else if (filters.startDate) {
    query += ' AND date >= ?';
    params.push(filters.startDate);
  } else if (filters.endDate) {
    query += ' AND date <= ?';
    params.push(filters.endDate);
  }

  if (filters.studentId) {
    query += ' AND studentId = ?';
    params.push(filters.studentId);
  }

  if (filters.itemName) {
    query += ' AND itemName = ?';
    params.push(filters.itemName);
  }

  if (filters.schoolId) {
    query += ' AND schoolId = ?';
    params.push(filters.schoolId);
  }

  const [rows] = await pool.query(query, params);
  return rows as PurchaseHistory[];
}


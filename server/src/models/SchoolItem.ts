// src/models/SchoolItem.ts

import pool from "../config/db";

export interface SchoolItem {
  schoolId: string;
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total_amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new SchoolItem
export async function createSchoolItem(item: SchoolItem): Promise<void> {
  const sql = `
    INSERT INTO SchoolItem (schoolId, itemId,name ,quantity, price, total_amount)
    VALUES (?, ?,?, ?, ?, ?)
  `;
  await pool.execute(sql, [
    item.schoolId,
    item.itemId,
    item.name,
    item.quantity,
    item.price,
    item.total_amount,
  ]);
}

// Get all SchoolItems for a school
export async function getSchoolItemsBySchoolId(schoolId:string): Promise<SchoolItem[]> {
  const [rows] = await pool.query(
    "SELECT * FROM SchoolItem WHERE schoolId = ?",
    [schoolId]
  );
  return rows as SchoolItem[];
}

// Get a specific SchoolItem by schoolId and itemId
export async function getSchoolItem(schoolId:string, itemId: string): Promise<SchoolItem | null> {
  const [rows] = await pool.query(
    "SELECT * FROM SchoolItem WHERE schoolId = ? AND itemId = ?",
    [schoolId, itemId]
  );
  const items = rows as SchoolItem[];
  return items.length > 0 ? items[0] : null;
}
export async function getSchoolItemByName(name:string): Promise<SchoolItem | null> {
  console.log(name)
  const [rows] = await pool.query(
    "SELECT * FROM SchoolItem WHERE name=?",
    [name]
  );
  const items = rows as SchoolItem[];
  return items.length > 0 ? items[0] : null;
}

// Update a SchoolItem's quantity and price
export async function updateSchoolItem(
  itemName: string,
  updates: { quantity?: number; price?: number; total_amount?: number }
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.quantity !== undefined) {
    fields.push("quantity = ?");
    values.push(updates.quantity);
  }
  if (updates.price !== undefined) {
    fields.push("price = ?");
    values.push(updates.price);
  }
  if (updates.total_amount !== undefined) {
    fields.push("total_amount = ?");
    values.push(updates.total_amount);
  }
  if (fields.length === 0) return;

  const sql = `UPDATE SchoolItem SET ${fields.join(", ")} WHERE name = ?`;
  values.push(itemName);
  await pool.execute(sql, values);
}

// Delete a SchoolItem
export async function deleteSchoolItem(schoolId:string, itemId:string): Promise<void> {
  await pool.execute(
    "DELETE FROM SchoolItem WHERE schoolId = ? AND itemId = ?",
    [schoolId, itemId]
  );
}
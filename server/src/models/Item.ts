// src/models/Item.ts
import pool from '../config/db';

export interface IItem {
  id?:string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total_amount: number;
  category_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new item
export async function createItem(item: IItem): Promise<string> {
  const [result]: any = await pool.execute(
    `INSERT INTO Item (id,name, description, quantity, price, total_amount, category_id)
     VALUES (?, ?, ?, ?, ?, ?,?)`,
    [
      item.id,
      item.name,
      item.description || null,
      item.quantity,
      item.price,
      item.total_amount,
      item.category_id
    ]
  );
  if(!item.id) return "Invalied id"
  return item.id;
}

// Find item by name
export async function findItemByName(name: string): Promise<IItem | null> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Item WHERE name = ? LIMIT 1',
    [name]
  );
  return rows[0] || null;
}

// Find item by id
export async function findItemById(id:string): Promise<IItem | null> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Item WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

// Update an item
export async function updateItem(id:string, item: Partial<IItem>): Promise<void> {
  const fields = [];
  const values = [];
  if (item.name !== undefined) { fields.push('name = ?'); values.push(item.name); }
  if (item.description !== undefined) { fields.push('description = ?'); values.push(item.description); }
  if (item.quantity !== undefined) { fields.push('quantity = ?'); values.push(item.quantity); }
  if (item.price !== undefined) { fields.push('price = ?'); values.push(item.price); }
  if (item.total_amount !== undefined) { fields.push('total_amount = ?'); values.push(item.total_amount); }
  if (item.category_id !== undefined) { fields.push('category_id = ?'); values.push(item.category_id); }
  values.push(id);

  await pool.execute(
    `UPDATE Item SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

// Delete an item
export async function deleteItem(id:string): Promise<void> {
  await pool.execute('DELETE FROM Item WHERE id = ?', [id]);
}

// List all items
export async function listItems(): Promise<IItem[]> {
  const [rows]: any = await pool.execute('SELECT * FROM Item');
  return rows;
}
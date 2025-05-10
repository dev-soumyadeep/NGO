import pool from '../config/db';

export interface ICategory {
  id?:string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new category
export async function createCategory(category: ICategory): Promise<boolean> {
  const [result]: any = await pool.execute(
    `INSERT INTO Category (id,name, description)
     VALUES (?, ?,?)`,
    [
      category.id,
      category.name,
      category.description || null,
    ]
  );
  return true;
}

// Find category by id
export async function findCategoryById(id:string): Promise<ICategory | null> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Category WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

// Find category by name
export async function findCategoryByName(name: string): Promise<ICategory | null> {
  const [rows]: any = await pool.execute(
    'SELECT * FROM Category WHERE name = ? LIMIT 1',
    [name]
  );
  return rows[0] || null;
}

// Update a category
export async function updateCategory(id:string, category: Partial<ICategory>): Promise<void> {
  const fields = [];
  const values = [];
  if (category.name !== undefined) { fields.push('name = ?'); values.push(category.name); }
  if (category.description !== undefined) { fields.push('description = ?'); values.push(category.description); }
  values.push(id);

  await pool.execute(
    `UPDATE Category SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

// Delete a category
export async function deleteCategory(id:string): Promise<void> {
  await pool.execute('DELETE FROM Category WHERE id = ?', [id]);
}

// List all categories
export async function listCategories(): Promise<ICategory[]> {
  const [rows]: any = await pool.execute('SELECT * FROM Category');
  return rows;
}
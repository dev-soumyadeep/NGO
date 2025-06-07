
export interface School {
  id: string;
  name: string;
  location: string;
  contactEmail: string;
  contactNumber: string;
  numberOfStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id?: string;
  date: string; // Format: YYYY-MM-DD or ISO string
  type: 'income' | 'expense';
  category: string;
  schoolName?: string;
  studentId?: string;
  schoolId?: string;
  itemName?: string;
  quantity?: number;
  price?: number;
  amount: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  email: string;
  role:string;
  createdAt?: string; // Optional, since it's not returned in the login response
  updatedAt?: string; // Optional, since it's not returned in the login response
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface SchoolFinancial {
  school: School;
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactions: Transaction[];
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Student {
  id?: string;
  name: string;
  class: string;
  contact: string;
  emailId?: string;
  address?: string;
  details?: string;
  dateOfBirth: string;      // Format: YYYY-MM-DD
  dateOfAdmission: string;  // Format: YYYY-MM-DD
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Alumni {
  id?: string;
  name: string;
  class: string;
  contact: string;
  emailId?: string;
  address?: string;
  details?: string;
  schoolId: string;
  dateOfBirth: string;      // Format: YYYY-MM-DD
  dateOfAdmission: string;  // Format: YYYY-MM-DD
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  totalInvestment?: number;
  createdAt?: Date;
  updatedAt?: Date;
}



export interface Item {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total_amount: number;
  category_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SchoolItem {
  schoolId: string;
  itemId: string;
  quantity: number;
  price: number;
  total_amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
}

export interface PurchaseHistory {
  date: Date;
  schoolId: string;
  studentId: string;
  itemName: string;
  quantity: number;
  amount: number;
}

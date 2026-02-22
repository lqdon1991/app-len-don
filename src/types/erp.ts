export type ContactCategory = 
  | 'friends'
  | 'colleagues'
  | 'neighbors'
  | 'classmates'
  | 'social'
  | 'other';

export interface PurchaseRecord {
  id: string;
  date: string;
  description: string;
  amount?: number;
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  age?: number;
  income?: string;
  family?: string;
  hasHouse: boolean;
  hasCar: boolean;
  category: ContactCategory;
  purchaseHistory: PurchaseRecord[];
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

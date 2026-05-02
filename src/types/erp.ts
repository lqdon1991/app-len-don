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
  pv?: number;
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
  uplineId?: string;
  crosslineIds: string[];
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

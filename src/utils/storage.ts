import { Contact } from '../types/erp';

const STORAGE_KEY = 'nutrilite_erp_contacts';

export function getContacts(): Contact[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as Contact[];
      return parsed.map(contact => ({
        ...contact,
        crosslineIds: contact.crosslineIds || [],
      }));
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
  return [];
}

export function saveContacts(contacts: Contact[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
}

export function addContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
  const contacts = getContacts();
  const now = new Date().toISOString();
  const newContact: Contact = {
    ...contact,
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    purchaseHistory: contact.purchaseHistory || [],
    crosslineIds: contact.crosslineIds || [],
    createdAt: now,
    updatedAt: now,
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
}

export function updateContact(id: string, updates: Partial<Contact>): Contact | null {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) return null;

  const updatedContact: Contact = {
    ...contacts[index],
    ...updates,
    id: contacts[index].id,
    updatedAt: new Date().toISOString(),
  };
  contacts[index] = updatedContact;
  saveContacts(contacts);
  return updatedContact;
}

export function deleteContact(id: string): boolean {
  const current = getContacts();
  const exists = current.some(c => c.id === id);
  if (!exists) return false;

  const contacts = current
    .filter(c => c.id !== id)
    .map(c => ({
      ...c,
      uplineId: c.uplineId === id ? undefined : c.uplineId,
      crosslineIds: (c.crosslineIds || []).filter(crossId => crossId !== id),
    }));

  saveContacts(contacts);
  return true;
}

export function getContactById(id: string): Contact | null {
  return getContacts().find(c => c.id === id) || null;
}

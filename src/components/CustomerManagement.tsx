import { useState, useEffect } from 'react';
import { Contact } from '../types/erp';
import { getContacts, addContact, updateContact, deleteContact } from '../utils/storage';
import ContactList from './ContactList';
import ContactForm from './ContactForm';

type ViewMode = 'list' | 'add' | 'edit';

export default function CustomerManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleSave = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingContact) {
      const updated = updateContact(editingContact.id, contactData);
      if (updated) {
        setContacts(getContacts());
        setViewMode('list');
        setEditingContact(null);
      }
    } else {
      addContact(contactData);
      setContacts(getContacts());
      setViewMode('list');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setViewMode('edit');
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setViewMode('add');
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingContact(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý thông tin bạn bè, đồng nghiệp, hàng xóm và các mối quan hệ
        </p>
      </div>

      {viewMode === 'list' ? (
        <ContactList
          contacts={contacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      ) : (
        <ContactForm
          contact={editingContact}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

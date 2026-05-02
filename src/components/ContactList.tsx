import { useState } from 'react';
import { Contact, ContactCategory } from '../types/erp';
import { contactCategoryLabels } from '../data/contactCategories';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export default function ContactList({ contacts, onEdit, onDelete, onAddNew }: ContactListProps) {
  const [filterCategory, setFilterCategory] = useState<ContactCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredContacts = contacts.filter(c => {
    const matchCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchSearch = !searchTerm || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });
  const contactMap = new Map(contacts.map(c => [c.id, c]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-64"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ContactCategory | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tất cả nhóm</option>
            {Object.entries(contactCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onAddNew}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
        >
          + Thêm khách hàng
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Hiển thị {filteredContacts.length} / {contacts.length} khách hàng
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          {contacts.length === 0 
            ? 'Chưa có khách hàng nào. Nhấn "Thêm khách hàng" để bắt đầu.'
            : 'Không tìm thấy khách hàng phù hợp với bộ lọc.'}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {contactCategoryLabels[contact.category]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {contact.age && <span>Tuổi: {contact.age}</span>}
                      {contact.income && <span>Thu nhập: {contact.income}</span>}
                      {contact.family && <span>Gia đình: {contact.family}</span>}
                      <span className="flex gap-2">
                        {contact.hasHouse && <span className="text-green-600">🏠 Có nhà</span>}
                        {contact.hasCar && <span className="text-green-600">🚗 Có xe</span>}
                        {!contact.hasHouse && !contact.hasCar && <span className="text-gray-400">-</span>}
                      </span>
                    </div>
                    {contact.phone && (
                      <p className="text-sm text-gray-600 mt-1">📞 {contact.phone}</p>
                    )}
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>
                        Upline: {contact.uplineId ? (contactMap.get(contact.uplineId)?.name || 'N/A') : 'Không có'}
                      </p>
                      <p>
                        Downline: {contacts.filter(c => c.uplineId === contact.id).length}
                      </p>
                      <p>
                        Crossline: {contact.crosslineIds.length === 0
                          ? 'Không có'
                          : contact.crosslineIds.map(id => contactMap.get(id)?.name || id).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(contact); }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm('Xóa khách hàng này?')) onDelete(contact.id); }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {contact.purchaseHistory.length} lần mua hàng
                  {contact.purchaseHistory.length > 0 && (
                    <span className="ml-2">
                      - Lần gần nhất: {new Date(contact.purchaseHistory[contact.purchaseHistory.length - 1].date).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>

              {expandedId === contact.id && contact.purchaseHistory.length > 0 && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="font-semibold mb-2">Lịch sử mua hàng</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pb-2">Thời gian</th>
                        <th className="pb-2">Mô tả</th>
                        <th className="pb-2">PV</th>
                        <th className="pb-2">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...contact.purchaseHistory].reverse().map(record => (
                        <tr key={record.id} className="border-t">
                          <td className="py-2">{new Date(record.date).toLocaleDateString('vi-VN')}</td>
                          <td className="py-2">{record.description}</td>
                          <td className="py-2">{record.pv ?? '-'}</td>
                          <td className="py-2">{record.amount ? record.amount.toLocaleString('vi-VN') + ' đ' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Contact, ContactCategory, PurchaseRecord } from '../types/erp';
import { contactCategoryOptions } from '../data/contactCategories';

interface ContactFormProps {
  contact?: Contact | null;
  contacts: Contact[];
  presetUplineId?: string;
  onSave: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const emptyContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  age: undefined,
  income: '',
  family: '',
  hasHouse: false,
  hasCar: false,
  category: 'friends',
  purchaseHistory: [],
  uplineId: undefined,
  crosslineIds: [],
  phone: '',
  email: '',
  address: '',
  notes: '',
};

export default function ContactForm({ contact, contacts, presetUplineId, onSave, onCancel }: ContactFormProps) {
  const currentId = contact?.id;
  const selectableContacts = useMemo(
    () => contacts.filter(c => c.id !== currentId),
    [contacts, currentId]
  );

  const [formData, setFormData] = useState<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>(
    contact ? {
      name: contact.name,
      age: contact.age,
      income: contact.income || '',
      family: contact.family || '',
      hasHouse: contact.hasHouse,
      hasCar: contact.hasCar,
      category: contact.category,
      purchaseHistory: contact.purchaseHistory,
      uplineId: contact.uplineId,
      crosslineIds: contact.crosslineIds || [],
      phone: contact.phone || '',
      email: contact.email || '',
      address: contact.address || '',
      notes: contact.notes || '',
    } : { ...emptyContact, uplineId: presetUplineId }
  );

  const [newPurchase, setNewPurchase] = useState<{ date: string; description: string; pv: string; amount: string; notes: string }>({
    date: '',
    description: '',
    pv: '',
    amount: '',
    notes: '',
  });

  const handleChange = (field: keyof typeof formData, value: string | number | boolean | PurchaseRecord[] | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPurchase = () => {
    if (!newPurchase.date || !newPurchase.description) return;
    const record: PurchaseRecord = {
      id: `purchase_${Date.now()}`,
      date: newPurchase.date,
      description: newPurchase.description,
      pv: newPurchase.pv ? parseFloat(newPurchase.pv) : undefined,
      amount: newPurchase.amount ? parseFloat(newPurchase.amount) : undefined,
      notes: newPurchase.notes || undefined,
    };
    handleChange('purchaseHistory', [...formData.purchaseHistory, record]);
    setNewPurchase({ date: '', description: '', pv: '', amount: '', notes: '' });
  };

  const handleRemovePurchase = (id: string) => {
    handleChange('purchaseHistory', formData.purchaseHistory.filter((p: PurchaseRecord) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Thông tin cơ bản</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Họ và tên"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm liên hệ</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as ContactCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {contactCategoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upline (cấp trên)</label>
            <select
              value={formData.uplineId || ''}
              onChange={(e) => handleChange('uplineId', e.target.value || undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Không có</option>
              {selectableContacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Crossline (cùng cấp)</label>
            <select
              multiple
              value={formData.crosslineIds}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                handleChange('crosslineIds', selected);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-28"
            >
              {selectableContacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Giữ Cmd/Ctrl để chọn nhiều người.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
            <input
              type="number"
              value={formData.age ?? ''}
              onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tuổi"
              min="1"
              max="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thu nhập</label>
            <input
              type="text"
              value={formData.income}
              onChange={(e) => handleChange('income', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 15-20 triệu, Cao, Trung bình..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gia đình</label>
            <input
              type="text"
              value={formData.family}
              onChange={(e) => handleChange('family', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Đã kết hôn, 2 con..."
            />
          </div>
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasHouse}
                onChange={(e) => handleChange('hasHouse', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Có nhà</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasCar}
                onChange={(e) => handleChange('hasCar', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Có xe</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Số điện thoại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Địa chỉ"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ghi chú thêm..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Lịch sử mua hàng</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày mua</label>
              <input
                type="date"
                value={newPurchase.date}
                onChange={(e) => setNewPurchase(p => ({ ...p, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <input
                type="text"
                value={newPurchase.description}
                onChange={(e) => setNewPurchase(p => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Sản phẩm đã mua"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PV</label>
              <input
                type="number"
                value={newPurchase.pv}
                onChange={(e) => setNewPurchase(p => ({ ...p, pv: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Điểm PV"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={newPurchase.amount}
                onChange={(e) => setNewPurchase(p => ({ ...p, amount: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Số tiền"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddPurchase}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Thêm
              </button>
            </div>
          </div>

          {formData.purchaseHistory.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Ngày</th>
                    <th className="px-4 py-2 text-left">Mô tả</th>
                    <th className="px-4 py-2 text-left">PV</th>
                    <th className="px-4 py-2 text-left">Số tiền</th>
                    <th className="px-4 py-2 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.purchaseHistory.map((record: PurchaseRecord) => (
                    <tr key={record.id} className="border-t">
                      <td className="px-4 py-2">{new Date(record.date).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-2">{record.description}</td>
                      <td className="px-4 py-2">{record.pv ?? '-'}</td>
                      <td className="px-4 py-2">{record.amount ? record.amount.toLocaleString('vi-VN') : '-'}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleRemovePurchase(record.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
        >
          {contact ? 'Cập nhật' : 'Thêm mới'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

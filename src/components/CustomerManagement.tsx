import { useState, useEffect } from 'react';
import { Contact } from '../types/erp';
import { getContacts, addContact, updateContact, deleteContact } from '../utils/storage';
import ContactList from './ContactList';
import ContactForm from './ContactForm';

type ViewMode = 'list' | 'add' | 'edit';
type Panel = 'list' | 'network' | 'commission' | 'simulation';

const PV_TO_VND = 26800;
const COMMISSION_LEVELS = [
  { pv: 200, percent: 3 },
  { pv: 600, percent: 6 },
  { pv: 1200, percent: 9 },
  { pv: 2400, percent: 12 },
  { pv: 4000, percent: 15 },
  { pv: 7000, percent: 18 },
  { pv: 10000, percent: 21 },
];

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getMonthlyPv(contact: Contact, month: string) {
  return contact.purchaseHistory
    .filter(record => record.date.startsWith(month))
    .reduce((sum, record) => sum + (record.pv || 0), 0);
}

function collectDownlineIds(rootId: string, contacts: Contact[]): string[] {
  const result: string[] = [];
  const stack = [rootId];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    const children = contacts.filter(contact => contact.uplineId === current);
    for (const child of children) {
      result.push(child.id);
      stack.push(child.id);
    }
  }
  return result;
}

function getTeamPv(contact: Contact, contacts: Contact[], month: string) {
  const downlineIds = collectDownlineIds(contact.id, contacts);
  const ownPv = getMonthlyPv(contact, month);
  const downlinePv = downlineIds
    .map(id => contacts.find(contactItem => contactItem.id === id))
    .filter((contactItem): contactItem is Contact => Boolean(contactItem))
    .reduce((sum, member) => sum + getMonthlyPv(member, month), 0);
  return ownPv + downlinePv;
}

function getCommissionLevel(pv: number) {
  return COMMISSION_LEVELS.reduce(
    (level, item) => (pv >= item.pv ? item : level),
    { pv: 0, percent: 0 }
  );
}

function TreeNode({
  contact,
  contacts,
  expandedIds,
  onToggle,
  onSelect,
  onAddDownline,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  contacts: Contact[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (contact: Contact) => void;
  onAddDownline: (uplineId: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}) {
  const children = contacts.filter(member => member.uplineId === contact.id);
  const isExpanded = expandedIds.has(contact.id);
  const hasChildren = children.length > 0;

  return (
    <div className="ml-4 mt-3">
      <div
        className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
        onClick={() => onSelect(contact)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(contact.id);
              }}
              className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200"
              disabled={!hasChildren}
            >
              {hasChildren ? (isExpanded ? '-' : '+') : '•'}
            </button>
            <div>
              <p className="font-semibold text-gray-800">{contact.name}</p>
              <p className="text-xs text-gray-500">
                Downline trực tiếp: {children.length}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onAddDownline(contact.id);
              }}
            >
              + Downline
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(contact);
              }}
            >
              Sửa
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Xóa khách hàng này?')) onDelete(contact.id);
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-200 ml-3 pl-2">
          {children.map(child => (
            <TreeNode
              key={child.id}
              contact={child}
              contacts={contacts}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddDownline={onAddDownline}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomerManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activePanel, setActivePanel] = useState<Panel>('list');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [presetUplineId, setPresetUplineId] = useState<string | undefined>(undefined);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<Contact | null>(null);
  const [month, setMonth] = useState<string>(getCurrentMonth());
  const [simulationTargetPv, setSimulationTargetPv] = useState<string>('');
  const [simulationContactId, setSimulationContactId] = useState<string>('');

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
        setPresetUplineId(undefined);
      }
    } else {
      addContact(contactData);
      setContacts(getContacts());
      setViewMode('list');
      setPresetUplineId(undefined);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setViewMode('edit');
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    const updatedContacts = getContacts();
    setContacts(updatedContacts);
    setSelectedNode(prev => (prev?.id === id ? null : prev));
    if (simulationContactId === id) {
      setSimulationContactId(updatedContacts[0]?.id || '');
    }
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setPresetUplineId(undefined);
    setViewMode('add');
  };

  const handleAddDownline = (uplineId: string) => {
    setEditingContact(null);
    setPresetUplineId(uplineId);
    setViewMode('add');
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingContact(null);
    setPresetUplineId(undefined);
  };

  const rootContacts = contacts.filter(c => !c.uplineId || !contacts.some(item => item.id === c.uplineId));
  const systemPv = contacts.reduce((sum, contact) => sum + getMonthlyPv(contact, month), 0);
  const systemCommission = getCommissionLevel(systemPv);
  const simulationContact = contacts.find(c => c.id === simulationContactId);
  const simulationCurrentPv = simulationContact ? getTeamPv(simulationContact, contacts, month) : 0;
  const simulationTarget = simulationTargetPv ? parseFloat(simulationTargetPv) : 0;
  const simulationLevel = getCommissionLevel(simulationTarget);
  const simulationCurrentLevel = getCommissionLevel(simulationCurrentPv);

  useEffect(() => {
    if (!simulationContactId && contacts.length > 0) {
      setSimulationContactId(contacts[0].id);
    }
  }, [contacts, simulationContactId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý thông tin bạn bè, đồng nghiệp, hàng xóm và các mối quan hệ
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button className={`px-4 py-2 rounded-lg ${activePanel === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => setActivePanel('list')}>
          Danh sách
        </button>
        <button className={`px-4 py-2 rounded-lg ${activePanel === 'network' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => setActivePanel('network')}>
          Sơ đồ hệ thống
        </button>
        <button className={`px-4 py-2 rounded-lg ${activePanel === 'commission' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => setActivePanel('commission')}>
          Hoa hồng tháng
        </button>
        <button className={`px-4 py-2 rounded-lg ${activePanel === 'simulation' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => setActivePanel('simulation')}>
          Simulation
        </button>
      </div>

      {viewMode === 'list' && activePanel === 'list' && (
        <ContactList
          contacts={contacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      )}

      {viewMode === 'list' && activePanel === 'network' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Tree / Network View</h2>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                + Thêm khách hàng
              </button>
            </div>
            {rootContacts.length === 0 ? (
              <p className="text-gray-500">Chưa có dữ liệu khách hàng.</p>
            ) : (
              rootContacts.map(root => (
                <TreeNode
                  key={root.id}
                  contact={root}
                  contacts={contacts}
                  expandedIds={expandedIds}
                  onToggle={(id) =>
                    setExpandedIds(prev => {
                      const clone = new Set(prev);
                      if (clone.has(id)) clone.delete(id);
                      else clone.add(id);
                      return clone;
                    })
                  }
                  onSelect={setSelectedNode}
                  onAddDownline={handleAddDownline}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Chi tiết node</h3>
            {!selectedNode ? (
              <p className="text-sm text-gray-500">Chọn một node để xem chi tiết.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <p><strong>Tên:</strong> {selectedNode.name}</p>
                <p><strong>Upline:</strong> {contacts.find(c => c.id === selectedNode.uplineId)?.name || 'Không có'}</p>
                <p><strong>Downline trực tiếp:</strong> {contacts.filter(c => c.uplineId === selectedNode.id).length}</p>
                <p><strong>Crossline:</strong> {selectedNode.crosslineIds.map(id => contacts.find(c => c.id === id)?.name || id).join(', ') || 'Không có'}</p>
                <p><strong>SĐT:</strong> {selectedNode.phone || '-'}</p>
                <p><strong>Ghi chú:</strong> {selectedNode.notes || '-'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'list' && activePanel === 'commission' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium">Tháng</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <div className="ml-auto text-sm">
              <p>PV toàn hệ thống: <strong>{systemPv.toLocaleString('vi-VN')}</strong></p>
              <p>Mức: <strong>{systemCommission.percent}%</strong> - Hoa hồng ước tính: <strong>{Math.round(systemPv * PV_TO_VND * (systemCommission.percent / 100)).toLocaleString('vi-VN')} đ</strong></p>
            </div>
          </div>
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Thành viên</th>
                  <th className="px-4 py-3 text-left">PV cá nhân</th>
                  <th className="px-4 py-3 text-left">PV hệ thống (gồm downline)</th>
                  <th className="px-4 py-3 text-left">Mức %</th>
                  <th className="px-4 py-3 text-left">Hoa hồng ước tính</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => {
                  const personalPv = getMonthlyPv(contact, month);
                  const teamPv = getTeamPv(contact, contacts, month);
                  const level = getCommissionLevel(teamPv);
                  const commission = Math.round(teamPv * PV_TO_VND * (level.percent / 100));
                  return (
                    <tr key={contact.id} className="border-t">
                      <td className="px-4 py-3">{contact.name}</td>
                      <td className="px-4 py-3">{personalPv.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3">{teamPv.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3">{level.percent}%</td>
                      <td className="px-4 py-3">{commission.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'list' && activePanel === 'simulation' && (
        <div className="bg-white rounded-lg border p-5 space-y-4">
          <h2 className="text-lg font-semibold">Giả lập hoa hồng</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Thành viên</label>
              <select
                value={simulationContactId}
                onChange={(e) => setSimulationContactId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Tháng</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">PV mục tiêu / giả định</label>
              <input
                type="number"
                value={simulationTargetPv}
                onChange={(e) => setSimulationTargetPv(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Nhập PV mục tiêu"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="font-semibold mb-1">Hiện tại</p>
              <p>PV hệ thống: {simulationCurrentPv.toLocaleString('vi-VN')}</p>
              <p>Mức: {simulationCurrentLevel.percent}%</p>
              <p>Hoa hồng: {Math.round(simulationCurrentPv * PV_TO_VND * (simulationCurrentLevel.percent / 100)).toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="font-semibold mb-1">Giả lập</p>
              <p>PV hệ thống: {simulationTarget.toLocaleString('vi-VN')}</p>
              <p>Mức: {simulationLevel.percent}%</p>
              <p>Hoa hồng: {Math.round(simulationTarget * PV_TO_VND * (simulationLevel.percent / 100)).toLocaleString('vi-VN')} đ</p>
              <p className="mt-2 text-blue-700">
                Delta: {(simulationTarget - simulationCurrentPv).toLocaleString('vi-VN')} PV / {(Math.round(simulationTarget * PV_TO_VND * (simulationLevel.percent / 100)) - Math.round(simulationCurrentPv * PV_TO_VND * (simulationCurrentLevel.percent / 100))).toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>
        </div>
      )}

      {(viewMode === 'add' || viewMode === 'edit') && (
        <ContactForm
          contact={editingContact}
          contacts={contacts}
          presetUplineId={presetUplineId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

import { ContactCategory } from '../types/erp';

export const contactCategoryLabels: Record<ContactCategory, string> = {
  friends: 'Bạn bè',
  colleagues: 'Đồng nghiệp',
  neighbors: 'Hàng xóm',
  classmates: 'Bạn học',
  social: 'QHXH (Quan hệ xã hội)',
  other: 'Khác',
};

export const contactCategoryOptions: { value: ContactCategory; label: string }[] = [
  { value: 'friends', label: 'Bạn bè' },
  { value: 'colleagues', label: 'Đồng nghiệp' },
  { value: 'neighbors', label: 'Hàng xóm' },
  { value: 'classmates', label: 'Bạn học' },
  { value: 'social', label: 'QHXH (Quan hệ xã hội)' },
  { value: 'other', label: 'Khác' },
];

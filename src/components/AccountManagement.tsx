import { useEffect, useState } from 'react';
import { getUsers, setUserPassword } from '../utils/authStorage';
import { UserRole } from '../types';

export default function AccountManagement() {
  const [adminPw, setAdminPw] = useState('');
  const [userPw, setUserPw] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const users = getUsers();
    const admin = users.find(u => u.id === 'admin');
    const user = users.find(u => u.id === 'user');
    // Note: we show defaults for UX; in real app you wouldn't.
    setAdminPw(admin ? (admin as any).password ?? '' : '');
    setUserPw(user ? (user as any).password ?? '' : '');
  }, []);

  const handleSave = () => {
    setSaved(null);
    const okAdmin = setUserPassword('admin', adminPw);
    const okUser = setUserPassword('user', userPw);
    if (!okAdmin || !okUser) {
      setSaved('Không thể lưu mật khẩu');
      return;
    }
    setSaved('Đã lưu');
    setTimeout(() => setSaved(null), 2000);
  };

  const roleHelp = (role: UserRole) => (role === 'admin' ? 'Full quyền' : 'Chỉ xem, không được sửa/không dùng CRM');

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý tài khoản</h1>
        <p className="text-gray-600 mt-1">Chỉ admin có quyền sửa và truy cập quản lý khách hàng.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">admin</h2>
            <p className="text-sm text-gray-500 mb-3">{roleHelp('admin')}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">user</h2>
            <p className="text-sm text-gray-500 mb-3">{roleHelp('user')}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Lưu
          </button>
          {saved && <div className="text-sm text-green-700 self-center">{saved}</div>}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Lưu ý: Đây là bản demo frontend (không có backend). Mật khẩu được lưu trong trình duyệt.
        </div>
      </div>
    </div>
  );
}


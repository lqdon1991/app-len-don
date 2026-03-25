import { ReactNode } from 'react';
import { UserRole } from '../types';

type Tab = 'menu' | 'customers' | 'manual' | 'account';

interface LayoutProps {
  children: ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  role: UserRole;
  onLogout: () => void;
}

export default function Layout({
  children,
  activeTab,
  onTabChange,
  role,
  onLogout
}: LayoutProps) {
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-800">
              Nutrilite ERP
            </h1>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Chức năng</span>
                <select
                  value={activeTab}
                  onChange={(e) => onTabChange(e.target.value as Tab)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="menu">🍽️ Lên đơn dinh dưỡng</option>
                  <option value="manual">📚 Manual cho người mới</option>
                  {isAdmin && <option value="customers">👥 Quản lý khách hàng</option>}
                  {isAdmin && <option value="account">🔑 Quản lý tài khoản</option>}
                </select>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8 px-4">
        {children}
      </main>
    </div>
  );
}

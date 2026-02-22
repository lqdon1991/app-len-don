import { ReactNode } from 'react';

type Tab = 'menu' | 'customers';

interface LayoutProps {
  children: ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-800">
              Nutrilite ERP
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => onTabChange('menu')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'menu'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🍽️ Lên đơn dinh dưỡng
              </button>
              <button
                onClick={() => onTabChange('customers')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'customers'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👥 Quản lý khách hàng
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

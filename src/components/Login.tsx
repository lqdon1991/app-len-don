import { useState } from 'react';
import { login } from '../utils/authStorage';
import { AppUser } from '../types';

export default function Login({ onLogin }: { onLogin: (user: AppUser) => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = login(username.trim(), password);
    if (!user) {
      setError('Sai tài khoản hoặc mật khẩu');
      return;
    }
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Đăng nhập</h1>
          <p className="text-sm text-gray-600 mb-6">
            Tài khoản mẫu: <strong>admin/admin</strong> hoặc <strong>user/user</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


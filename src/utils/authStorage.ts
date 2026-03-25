import { AppUser, UserRole } from '../types';

type StoredUser = AppUser & { password: string };

const USERS_KEY = 'nutrilite_auth_users_v1';
const SESSION_KEY = 'nutrilite_auth_session_v1';

function seedDefaultUsersIfNeeded(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as StoredUser[];
    }
  } catch {
    // ignore
  }

  const defaults: StoredUser[] = [
    { id: 'admin', username: 'admin', role: 'admin', password: 'admin' },
    { id: 'user', username: 'user', role: 'user', password: 'user' }
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function getUsers(): StoredUser[] {
  return seedDefaultUsersIfNeeded();
}

export function getCurrentSessionUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { userId: string };
    if (!parsed?.userId) return null;

    const user = getUsers().find(u => u.id === parsed.userId);
    if (!user) return null;
    const { password: _pw, ...safe } = user;
    return safe;
  } catch {
    return null;
  }
}

export function login(username: string, password: string): AppUser | null {
  const users = getUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if (!found) return null;

  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }));
  const { password: _pw, ...safe } = found;
  return safe;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function setUserPassword(userId: string, newPassword: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return false;
  users[index] = { ...users[index], password: newPassword };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

export function getRoleByUserId(userId: string): UserRole | null {
  const user = getUsers().find(u => u.id === userId);
  return user?.role ?? null;
}


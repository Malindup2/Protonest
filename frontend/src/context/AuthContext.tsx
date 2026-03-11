'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const role = Cookies.get('role');

    if (token && username && role) {
      setUser({ username, role });
    } else {
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  const login = (token: string, username: string, role: string) => {
    Cookies.set('token', token, { expires: 1 });
    Cookies.set('username', username, { expires: 1 });
    Cookies.set('role', role, { expires: 1 });
    setUser({ username, role });
    router.push('/');
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('role');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

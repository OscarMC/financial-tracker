import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '@/types';
import { hashPassword, verifyPassword, setEncryptedItem, getEncryptedItem } from '@/lib/encryption';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  username: 'admin',
  passwordHash: hashPassword('admin123'),
  mustChangePassword: true,
};

const USER_KEY = 'finance_tracker_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    const storedUser = getEncryptedItem<User>(USER_KEY);
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Create default user if none exists
      setEncryptedItem(USER_KEY, DEFAULT_USER);
      setUser(DEFAULT_USER);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const storedUser = getEncryptedItem<User>(USER_KEY);
    const currentUser = storedUser || DEFAULT_USER;
    
    if (username === currentUser.username && verifyPassword(password, currentUser.passwordHash)) {
      setIsAuthenticated(true);
      setUser(currentUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const changePassword = useCallback((newPassword: string) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        passwordHash: hashPassword(newPassword),
        mustChangePassword: false,
      };
      setEncryptedItem(USER_KEY, updatedUser);
      setUser(updatedUser);
    }
  }, [user]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    changePassword,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

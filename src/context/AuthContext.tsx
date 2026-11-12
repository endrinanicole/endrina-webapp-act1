import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ToastMessage } from '../types';
import { INITIAL_USERS } from '../data/initialVaultData';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  signIn: (email: string, password?: string) => { success: boolean; message?: string };
  signUp: (data: {
    name: string;
    email: string;
    role: 'freelancer' | 'client';
    companyOrTitle: string;
  }) => { success: boolean; message?: string };
  signOut: () => void;
  switchAccount: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY_AUTH_USER = 'clientvault_auth_user_v1';
const STORAGE_KEY_ALL_USERS = 'clientvault_all_users_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to the designer/freelancer account
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  const signIn = (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}! Signed in successfully.`);
      return { success: true };
    }

    return {
      success: false,
      message: 'No account found with this email. Please check your credentials or create an account.',
    };
  };

  const signUp = ({
    name,
    email,
    role,
    companyOrTitle,
  }: {
    name: string;
    email: string;
    role: 'freelancer' | 'client';
    companyOrTitle: string;
  }) => {
    if (!name.trim() || !email.trim()) {
      return { success: false, message: 'Please provide both your name and email address.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const exists = allUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role,
      companyOrTitle: companyOrTitle.trim() || (role === 'freelancer' ? 'Independent Designer' : 'Client Representative'),
      avatarBgColor: role === 'freelancer' ? '#3b82f6' : '#10b981',
      joinedAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created! Welcome to ClientVault, ${newUser.name}.`);
    return { success: true };
  };

  const signOut = () => {
    setCurrentUser(null);
    showToast('You have signed out of ClientVault.', 'info');
  };

  const switchAccount = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active account to ${target.name} (${target.role})`);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile information updated.');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        signIn,
        signUp,
        signOut,
        switchAccount,
        updateProfile,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

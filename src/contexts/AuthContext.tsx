"use client"

import type { User, Employee, HR } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockEmployees, mockHRs } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (psn: number, password?: string) => Promise<boolean>; // psn changed to number
  signup: (psn: number, password?: string) // psn changed to number
    => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<boolean>; // psn changed to number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (psn: number, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employeeUser = mockEmployees.find(e => e.psn === psn) as Employee | undefined;
    const hrUser = mockHRs.find(h => h.psn === psn) as HR | undefined;
    
    let foundUser: User | null = null;
    if (employeeUser) {
      foundUser = { ...employeeUser, role: 'Employee' };
    } else if (hrUser) {
      foundUser = { ...hrUser, role: hrUser.priority === 1 ? 'Head HR' : 'HR' };
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const checkPSNExists = async (psn: number): Promise<boolean> => {
    const employeeExists = mockEmployees.some(e => e.psn === psn);
    const hrExists = mockHRs.some(h => h.psn === psn);
    return employeeExists || hrExists;
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string; user?: User }> => {
    setLoading(true);
    const psnExists = await checkPSNExists(psn);
    if (!psnExists) {
      setLoading(false);
      return { success: false, message: "PSN not found in company records." };
    }

    const employeeUser = mockEmployees.find(e => e.psn === psn) as Employee | undefined;
    const hrUser = mockHRs.find(h => h.psn === psn) as HR | undefined;
    let newUser: User | undefined;

    if (employeeUser) newUser = { ...employeeUser, role: 'Employee' };
    else if (hrUser) newUser = { ...hrUser, role: hrUser.priority === 1 ? 'Head HR' : 'HR' };
    
    if (newUser && password) { 
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setLoading(false);
        return { success: true, message: "Account created successfully!", user: newUser };
    }
    
    setLoading(false);
    return { success: false, message: "Failed to create account. Please try again." };
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, checkPSNExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

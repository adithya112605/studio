"use client"

import type { User, Employee, HR } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockEmployees, mockHRs } from '@/data/mockData'; // Assuming mockData is created

interface AuthContextType {
  user: User | null;
  login: (psn: string, password?: string) => Promise<boolean>; // Password optional for initial checks
  signup: (psn: string, password?: string) // For completing signup with password
    => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage (e.g., if page reloaded)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (psn: string, password?: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you'd verify psn and password against a backend
    // For mock: find user in employees or HRs
    const employeeUser = mockEmployees.find(e => e.psn === psn) as Employee | undefined;
    const hrUser = mockHRs.find(h => h.psn === psn) as HR | undefined;
    
    let foundUser: User | null = null;
    if (employeeUser) {
      foundUser = { ...employeeUser, role: 'Employee' };
    } else if (hrUser) {
      foundUser = { ...hrUser, role: hrUser.priority === 1 ? 'Head HR' : 'HR' };
    }

    if (foundUser) {
      // Mock: Assume password is correct for now if provided, or not needed for initial check
      // In a real app: if (password && await verifyPassword(psn, password))
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const checkPSNExists = async (psn: string): Promise<boolean> => {
    // Check if PSN exists in employees or HRs (for signup)
    const employeeExists = mockEmployees.some(e => e.psn === psn);
    const hrExists = mockHRs.some(h => h.psn === psn);
    return employeeExists || hrExists;
  };

  const signup = async (psn: string, password?: string): Promise<{ success: boolean; message: string; user?: User }> => {
    setLoading(true);
    const psnExists = await checkPSNExists(psn);
    if (!psnExists) {
      setLoading(false);
      return { success: false, message: "PSN not found in company records." };
    }

    // Simulate account creation/password setting
    // In a real app, this would involve a backend call to set/update password
    const employeeUser = mockEmployees.find(e => e.psn === psn) as Employee | undefined;
    const hrUser = mockHRs.find(h => h.psn === psn) as HR | undefined;
    let newUser: User | undefined;

    if (employeeUser) newUser = { ...employeeUser, role: 'Employee' };
    else if (hrUser) newUser = { ...hrUser, role: hrUser.priority === 1 ? 'Head HR' : 'HR' };
    
    if (newUser && password) { // Assume password setting is successful
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

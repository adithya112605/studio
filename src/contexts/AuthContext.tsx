
"use client"

import type { User, Employee, Supervisor } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockEmployees, mockSupervisors } from '@/data/mockData';

interface AuthContextType {
  user: User | null; // User can be Employee or Supervisor
  login: (psn: number, password?: string) => Promise<boolean>;
  signup: (psn: number, password?: string)
    => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Basic validation of stored user structure
        if (parsedUser && parsedUser.psn && parsedUser.name && parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('currentUser'); // Clear invalid stored user
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (psn: number, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Check if it's an employee
    const employeeUser = mockEmployees.find(e => e.psn === psn);
    if (employeeUser) {
      const loggedInUser: Employee = { ...employeeUser }; // Role is already 'Employee'
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }

    // Check if it's a supervisor
    const supervisorUser = mockSupervisors.find(s => s.psn === psn);
    if (supervisorUser) {
      const loggedInUser: Supervisor = { ...supervisorUser }; // Role is IS, NS, DH, or IC Head
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const checkPSNExists = async (psn: number): Promise<boolean> => {
    const employeeExists = mockEmployees.some(e => e.psn === psn);
    const supervisorExists = mockSupervisors.some(s => s.psn === psn);
    return employeeExists || supervisorExists;
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string; user?: User }> => {
    setLoading(true);
    // Signup is primarily for employees to set their password for a pre-existing record.
    // Supervisors are assumed to be added by an admin.
    const employeeRecord = mockEmployees.find(e => e.psn === psn);

    if (!employeeRecord) {
      setLoading(false);
      return { success: false, message: "PSN not found in employee records. Please contact Admin." };
    }
    
    // Simulate password setting - in real app, hash and store password
    if (password) {
        const signedUpUser: Employee = { ...employeeRecord };
        setUser(signedUpUser);
        localStorage.setItem('currentUser', JSON.stringify(signedUpUser));
        setLoading(false);
        return { success: true, message: "Account password set successfully! You are now logged in.", user: signedUpUser };
    }
    
    setLoading(false);
    return { success: false, message: "Failed to set password. Please try again." };
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

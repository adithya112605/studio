"use client";

import type { PasswordStrengthResult } from '@/types';
import React, { useEffect, useState } from 'react';

interface PasswordStrengthProps {
  password?: string;
  onStrengthChange?: (result: PasswordStrengthResult) => void;
}

// Basic password strength checker (can be replaced with a library like zxcvbn)
const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  let score = 0;
  const messages = [];
  let isValid = false;

  if (!password || password.length === 0) {
    return { score: 0, isValid: false, message: "Enter a password" };
  }

  if (password.length >= 8) {
    score++;
  } else {
    messages.push("at least 8 characters");
  }
  if (/[a-z]/.test(password)) score++; else messages.push("a lowercase letter");
  if (/[A-Z]/.test(password)) score++; else messages.push("an uppercase letter");
  if (/[0-9]/.test(password)) score++; else messages.push("a digit");
  if (/[^a-zA-Z0-9]/.test(password)) score++; else messages.push("a special character");

  let strength = "";
  switch (score) {
    case 0:
    case 1:
      strength = "Very Weak";
      break;
    case 2:
      strength = "Weak";
      break;
    case 3:
      strength = "Medium";
      break;
    case 4:
      strength = "Strong";
      break;
    case 5:
      strength = "Very Strong";
      isValid = true;
      break;
    default:
      strength = "Very Weak";
  }
  
  const finalMessage = isValid ? `Strength: ${strength}` : `Include: ${messages.slice(0,2).join(', ')}${messages.length > 2 ? '...' : ''}`;

  return { score, isValid, message: finalMessage };
};


const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = "", onStrengthChange }) => {
  const [strengthResult, setStrengthResult] = useState<PasswordStrengthResult>({ score: 0, isValid: false, message: ""});

  useEffect(() => {
    const result = checkPasswordStrength(password);
    setStrengthResult(result);
    if (onStrengthChange) {
      onStrengthChange(result);
    }
  }, [password, onStrengthChange]);

  const getBarColor = () => {
    switch (strengthResult.score) {
      case 0: return 'bg-gray-300'; // No password
      case 1: return 'bg-red-500';   // Very Weak
      case 2: return 'bg-orange-500';// Weak
      case 3: return 'bg-yellow-500';// Medium
      case 4: return 'bg-lime-500';  // Strong
      case 5: return 'bg-green-500'; // Very Strong
      default: return 'bg-gray-300';
    }
  };
  
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-in-out ${getBarColor()}`}
          style={{ width: `${(strengthResult.score / 5) * 100}%` }}
        />
      </div>
      <p className={`mt-1 text-xs ${strengthResult.isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
        {strengthResult.message}
      </p>
    </div>
  );
};

export default PasswordStrength;

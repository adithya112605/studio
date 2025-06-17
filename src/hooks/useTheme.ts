"use client"
// This hook is largely provided by next-themes itself.
// This file can be a pass-through or for custom theme logic if needed.
// For now, directly use useTheme from 'next-themes' where needed.

import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  return useNextTheme();
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DestinationTheme, defaultThemes, getDestinationTheme } from './destinationThemes';

export type Mode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  destinationTheme: DestinationTheme;
  setDestinationThemeByName: (name?: string) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('dark');
  const [destinationTheme, setDestinationTheme] = useState<DestinationTheme>(defaultThemes.default);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('wasl_theme_mode') as Mode | null;
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('wasl_theme_mode', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const setDestinationThemeByName = (name?: string) => {
    const theme = getDestinationTheme(name);
    setDestinationTheme(theme);
  };

  useEffect(() => {
    const root = document.documentElement;
    let effectiveDark = mode === 'dark';

    if (mode === 'system') {
      effectiveDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDark(effectiveDark);

    if (effectiveDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Apply destination CSS Variables
    root.style.setProperty('--wasl-primary', destinationTheme.primary);
    root.style.setProperty('--wasl-secondary', destinationTheme.secondary);
    root.style.setProperty('--wasl-accent', destinationTheme.accent);
    root.style.setProperty('--wasl-glow', destinationTheme.glow);
    root.style.setProperty('--wasl-card-bg', destinationTheme.cardBg);
    root.style.setProperty('--wasl-border-glow', destinationTheme.borderGlow);
    root.style.setProperty('--wasl-particle-color', destinationTheme.particleColor);
  }, [mode, destinationTheme]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        destinationTheme,
        setDestinationThemeByName,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

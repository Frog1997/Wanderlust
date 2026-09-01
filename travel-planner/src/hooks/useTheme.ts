import { useState, useEffect } from 'react';

export type ThemeColor = 'teal' | 'rose' | 'amber' | 'indigo' | 'emerald' | 'sky' | 'violet' | 'fuchsia';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('app-dark-mode') === 'true' || 
           (!localStorage.getItem('app-dark-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    return (localStorage.getItem('app-theme-color') as ThemeColor) || 'teal';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app-dark-mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
    localStorage.setItem('app-theme-color', themeColor);
  }, [themeColor]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return { isDarkMode, toggleDarkMode, themeColor, setThemeColor };
}

import { AppBar, ToggleThemeButton } from 'react-admin';
import { handleThemeChange } from './theme/themes.js';
import { useEffect } from 'react';

export const MyAppBar = ({ isDarkTheme, onThemeToggle }) => {
  const handleThemeToggle = () => {
    handleThemeChange(onThemeToggle);
  };

  useEffect(() => {
    console.log('Theme:', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <AppBar toolbar={<ToggleThemeButton onClick={handleThemeToggle} />} />
  );
};
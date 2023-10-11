import { AppBar, ToggleThemeButton } from 'react-admin';
import { useState, useEffect } from 'react';
import { lightTheme, darkTheme, handleThemeChange } from './theme/themes.js';

export const MyAppBar = () => {
    const [theme, setTheme] = useState(lightTheme);

    return (
        <AppBar toolbar={<ToggleThemeButton />} />
    );
};
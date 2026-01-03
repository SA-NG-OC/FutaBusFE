/* src/context/ThemeContext.tsx */
'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
} | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');
    // Dùng ref để check xem đây có phải lần render đầu tiên không
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Lần chạy đầu tiên: Chỉ đồng bộ State với Storage, KHÔNG can thiệp vào DOM (để Script ở layout tự lo)
        if (isFirstRender.current) {
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme) {
                setTheme(savedTheme);
            }
            isFirstRender.current = false;
            return;
        }

        // Các lần chạy sau (khi user bấm nút): Mới can thiệp vào DOM
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return ctx;
};
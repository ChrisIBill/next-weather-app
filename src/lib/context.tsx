'use client'
import { createContext, useContext, useState } from 'react'
import UserPrefs, { ThemeType } from '@/lib/user'
import { Tillana } from 'next/font/google'

type ThemeState = {
    theme: ThemeType
    setTheme: (theme: ThemeType) => void
}
const ThemeContext = createContext<ThemeState | null>(null)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }

    return context
}

export interface ThemeProviderProps {
    children: React.ReactNode
}

export const ThemeProvider = (props: ThemeProviderProps) => {
    const user = new UserPrefs()
    const [theme, setTheme] = useState<ThemeType>(user.themePrefs)
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}

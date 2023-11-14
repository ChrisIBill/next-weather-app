'use client'
import { createContext, useContext, useState } from 'react'
import UserPrefs, { ThemeLiteralsType } from '@/lib/user'
import { Tillana } from 'next/font/google'

type ThemeState = {
    theme: ThemeLiteralsType
    setTheme: (theme: ThemeLiteralsType) => void
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
    const [theme, setTheme] = useState<ThemeLiteralsType>(user.themePrefs)
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}

//User Preferences Context
type UserState = {
    user: UserPrefs
    setUser: (user: UserPrefs) => void
}
const UserContext = createContext<UserState | null>(null)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }

    return context
}

export interface UserProviderProps {
    children: React.ReactNode
}

export const UserProvider = (props: UserProviderProps) => {
    const [userPrefs, setUserPrefs] = useState<UserPrefs>(new UserPrefs())
    return (
        <UserContext.Provider
            value={{ user: userPrefs, setUser: setUserPrefs }}
        >
            {props.children}
        </UserContext.Provider>
    )
}

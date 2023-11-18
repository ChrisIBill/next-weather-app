'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import UserPrefs, {
    DEFAULT_USER_PREFS,
    ThemeLiteralsType,
    ThemeTypes,
    UserPreferencesInterface,
} from '@/lib/user'
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

const getInitialTheme = () => {
    let theme = 'light'
    if (localStorage && localStorage.getItem('theme')) {
        theme = localStorage.getItem('theme') || 'light'
        theme = JSON.parse(theme)
    } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        theme = 'dark'
    }
    document.documentElement.setAttribute('data-theme', theme)

    return theme as ThemeLiteralsType
}

export const ThemeProvider = (props: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeLiteralsType>(getInitialTheme())

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme))
        document.documentElement.setAttribute('data-theme', theme)
    })
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}

//User Preferences Context
type UserState = {
    user: UserPreferencesInterface
    setUser: (user: UserPreferencesInterface) => void
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

export const getInitialUser = () => {
    const user = localStorage.getItem('userPrefs')
    return user ? JSON.parse(user) : DEFAULT_USER_PREFS
}

export const UserProvider = (props: UserProviderProps) => {
    const [userPrefs, setUserPrefs] = useState<UserPreferencesInterface>(
        getInitialUser()
    )

    useEffect(() => {
        localStorage.setItem('userPrefs', JSON.stringify(userPrefs))
    })
    return (
        <UserContext.Provider
            value={{ user: userPrefs, setUser: setUserPrefs }}
        >
            {props.children}
        </UserContext.Provider>
    )
}

'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserPrefs, {
    DEFAULT_USER_PREFS,
    ThemeLiteralsType,
    ThemeTypes,
    UserPreferencesInterface,
} from '@/lib/user'
import { Tillana } from 'next/font/google'
import { PaletteMode, Theme, createTheme } from '@mui/material'
import { getPaletteMode } from './paletteHandler'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

type ThemeState = {
    theme: ThemeLiteralsType
    setTheme: (theme: ThemeLiteralsType) => void
}
type mThemeState = {
    theme: Theme
}
type ColorState = {
    toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeState | null>(null)
const MThemeContext = createContext<mThemeState | null>(null)
const ColorModeContext = createContext<ColorState | null>(null)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }

    return context
}
export const useMTheme = () => {
    const context = useContext(MThemeContext)
    if (!context) {
        throw new Error('useMTheme must be used within a ThemeProvider')
    }
    return context
}
export const useColorMode = () => {
    const context = useContext(ColorModeContext)
    if (!context) {
        throw new Error('useColorMode must be used within a ThemeProvider')
    }
    return context
}

export interface ThemeProviderProps {
    children: React.ReactNode
}

const getInitialTheme = () => {
    let theme = 'light'
    if (localStorage !== undefined) {
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
const getInitialMTheme = () => {
    let theme = 'light'
    if (localStorage !== undefined) {
        theme = localStorage.getItem('theme') || 'light'
        theme = JSON.parse(theme)
    } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        theme = 'dark'
    }
    document.documentElement.setAttribute('data-theme', theme)

    return theme as PaletteMode
}

export const ThemeProvider = (props: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeLiteralsType>(getInitialTheme())

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme))
        console.log('Setting theme: ', theme)
        document.documentElement.setAttribute('data-theme', theme)
    })
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export const MThemeProvider = (props: ThemeProviderProps) => {
    const [mode, setMode] = useState<PaletteMode>(getInitialMTheme())
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
            },
        }),
        []
    )

    const mTheme = useMemo(() => createTheme(getPaletteMode(mode)), [mode])
    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={mTheme}>{props.children}</MuiThemeProvider>
        </ColorModeContext.Provider>
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

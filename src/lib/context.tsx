'use client'
import { createContext, useContext, useMemo, useState } from 'react'
import { PaletteMode, Theme, createTheme } from '@mui/material'
import { getPaletteMode } from './paletteHandler'
import { ThemeProvider } from '@mui/material/styles'

const THEME_TYPES = ['light', 'dark'] as const
type ThemeType = (typeof THEME_TYPES)[number]

type ThemeState = {
    theme: Theme
}
type ColorState = {
    toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeState | null>(null)
const ColorModeContext = createContext<ColorState | null>(null)

export const useMTheme = () => {
    const context = useContext(ThemeContext)
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
    if (localStorage !== undefined && localStorage.getItem('theme')) {
        const local = localStorage.getItem('theme')
        const parsed = local ? JSON.parse(local) : 'light'
        if (THEME_TYPES.includes(parsed)) theme = parsed
    } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        theme = 'dark'
    }
    document.documentElement.setAttribute('data-theme', theme)

    return theme as PaletteMode
}

export const UserThemeProvider = (props: ThemeProviderProps) => {
    const [mode, setMode] = useState<PaletteMode>(getInitialTheme())
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
            },
        }),
        []
    )

    const theme = useMemo(() => createTheme(getPaletteMode(mode)), [mode])
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </ColorModeContext.Provider>
    )
}

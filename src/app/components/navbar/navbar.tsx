'use client'
import { AppBar, Autocomplete, Toolbar, styled } from '@mui/material'
import styles from './navbar.module.scss'
import SearchBar from './search-bar'
import { Settings } from './settings'
import paletteHandler from '@/lib/paletteHandler'
import UserPrefs from '@/lib/user'
import React from 'react'
import useLocalStorage from 'use-local-storage'
import { useTheme } from '@/lib/context'

export interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = () => {
    //TODO: If mobile, render navbar in footer
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)
    console.log('User Theme: ', theme)
    return (
        <header className={styles.header} data-theme={theme.theme}>
            <div className={styles.glowBox} />
            <AppBar
                className={styles.MuiAppBar}
                data-theme={theme.theme}
                sx={{}}
            >
                <Toolbar
                    className={styles.Toolbar}
                    sx={{
                        background: `${palette.primary}`,
                        borderRadius: '0 0 1rem 1rem',
                        color: palette.textPrimary,
                    }}
                >
                    <div className={styles.fillerElement}></div>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>Drizzle</h1>
                        <h3 className={styles.subtitle}>
                            (Yet Another Weather App)
                        </h3>
                    </div>
                    <div className={styles.itemsWrapper}>
                        <SearchBar />
                        <Settings />
                    </div>
                </Toolbar>
            </AppBar>
        </header>
    )
}

export default NavBar

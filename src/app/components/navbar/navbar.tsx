'use client'
import { AppBar, Toolbar, styled } from '@mui/material'
import styles from './navbar.module.scss'
import SearchBar from './search-bar'
import { Settings } from './settings'
import React from 'react'
import { useTheme } from '@mui/material/styles'
import { useWindowDimensions } from '@/lib/hooks'
import dynamic from 'next/dynamic'

const TitleWrapper = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        h3: {
            display: 'none',
        },
    },
}))

export interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = () => {
    //TODO: If mobile, render navbar in footer
    const theme = useTheme()
    const palette = theme.palette
    const windowDimensions = useWindowDimensions()
    return (
        <AppBar
            className={styles.MuiAppBar}
            data-theme={theme.palette.mode}
            sx={{}}
        >
            <Toolbar
                className={styles.Toolbar}
                sx={{
                    background: palette.primary.main,
                    color: palette.primary.contrastText,
                    borderRadius: '0 0 1rem 1rem',
                    [theme.breakpoints.down('md')]: {
                        justifyContent: 'center',
                    },
                }}
            >
                {(windowDimensions?.width ?? 0) > 900 ? (
                    <div className={styles.fillerElement}></div>
                ) : null}
                <TitleWrapper className={styles.titleWrapper}>
                    <h1 className={styles.title}>Drizzle</h1>
                    <h3 className={styles.subtitle}>
                        (Yet Another Weather App)
                    </h3>
                </TitleWrapper>
                <div className={styles.itemsWrapper}>
                    <SearchBar />
                    <Settings />
                </div>
            </Toolbar>
            <div className={styles.glowBox} />
        </AppBar>
    )
}

export default NavBar

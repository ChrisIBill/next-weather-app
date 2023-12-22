'use client'
import { AppBar, Toolbar, Typography, styled } from '@mui/material'
import styles from './navbar.module.scss'
import SearchBar from './search-bar'
import { Settings } from './settings'
import React, { useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import { useWindowDimensions } from '@/lib/hooks'
import dynamic from 'next/dynamic'
import { LocationReadout } from './locationReadout'

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
    const [isMounted, setIsMounted] = React.useState(false)
    const [isSearchExpanded, setIsSearchExpanded] = React.useState(false)
    const theme = useTheme()
    const palette = theme.palette
    const handleSearchExpand = (expanded: boolean) => {
        setIsSearchExpanded(expanded)
    }
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
                <LocationReadout isSearchExpanded={isSearchExpanded} />
                <TitleWrapper
                    className={styles.titleWrapper}
                    style={{
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        variant="h1"
                        fontFamily="RobotoSlab"
                        fontWeight="bold"
                        noWrap
                        className={styles.title}
                    >
                        Drizzle
                    </Typography>
                    <Typography
                        variant="h3"
                        fontFamily="RobotoSlab"
                        fontWeight="normal"
                        noWrap
                        className={styles.subtitle}
                        style={{}}
                    >
                        (Yet Another Weather App)
                    </Typography>
                </TitleWrapper>
                <div className={styles.itemsWrapper}>
                    <SearchBar
                        isExpanded={isSearchExpanded}
                        handleExpand={handleSearchExpand}
                    />
                    <Settings />
                </div>
            </Toolbar>
            <div className={styles.glowBox} />
        </AppBar>
    )
}

export default NavBar

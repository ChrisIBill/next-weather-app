'use client'
import {
    AppBar,
    Slide,
    Toolbar,
    Typography,
    styled,
    useScrollTrigger,
} from '@mui/material'
import styles from './navbar.module.scss'
import SearchBar from './search-bar'
import { Settings } from './settings'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useScrollPosition } from '@/lib/hooks'
import { LocationReadout } from './locationReadout'
import logger from '@/lib/pinoLogger'

const NavBarLogger = logger.child({ component: 'NavBar' })

const TitleWrapper = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        h3: {
            display: 'none',
        },
    },
}))

export interface NavBarProps {}
interface Props {
    window?: () => Window
    children: React.ReactElement
}

const NavBar: React.FC<NavBarProps> = (props) => {
    NavBarLogger.debug('Rendering NavBar')
    //TODO: If mobile, render navbar in footer
    const [isSearchExpanded, setIsSearchExpanded] = React.useState(false)
    const theme = useTheme()
    const palette = theme.palette
    const handleSearchExpand = (expanded: boolean) => {
        setIsSearchExpanded(expanded)
    }
    return (
        <HideOnScroll {...props}>
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
        </HideOnScroll>
    )
}

export default NavBar

export const HideOnScroll = (props: Props) => {
    NavBarLogger.debug('HideOnScroll', { props })
    const { children } = props
    const [scrollPosition, setScrollPosition] = useScrollPosition()
    const scrollTrigger = useScrollTrigger()
    const [trigger, setTrigger] = useState(scrollTrigger)
    NavBarLogger.debug('HideOnScroll', { trigger, scrollPosition })
    useEffect(() => {
        setTrigger(scrollTrigger)
    }, [scrollTrigger])
    return (
        <div
            onMouseEnter={() => setTrigger(false)}
            onMouseLeave={() => setTrigger(scrollTrigger)}
            style={{
                position: 'fixed',
                top: 0,
                width: '100vw',
                height: '4rem',
                zIndex: 1000,
            }}
        >
            <Slide
                appear={true}
                direction="down"
                in={!trigger}
                onMouseEnter={() => setTrigger(false)}
                style={{
                    position: 'fixed',
                }}
            >
                {children}
            </Slide>
        </div>
    )
}

'use client'

import SettingsIcon from '@mui/icons-material/Settings'
import styles from './navbar.module.scss'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import { useColorMode } from '@/lib/context'
import { useTheme } from '@mui/material/styles'
import { ANIMATION_PREF_STRINGS, useUserPrefsStore } from '@/lib/stores'

export interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}: SettingsProps) => {
    const userPrefs = useUserPrefsStore()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const settingsRef = React.useRef<HTMLDivElement>(null)

    const palette = useTheme().palette
    const colorMode = useColorMode()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log('clicked', event.currentTarget)
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleAnimationsItem = () => {
        userPrefs.nextAnimationLevel()
    }
    const handleTemperatureItem = () => {
        userPrefs.nextTempUnit()
    }
    const handleWindSpeedItem = () => {
        userPrefs.nextWindUnit()
    }
    const handlePrecipitationItem = () => {
        userPrefs.nextPrecipitationUnit()
    }
    const handleThemeItem = () => {
        colorMode.toggleColorMode()
    }

    return (
        <div className={styles.settingsWrapper} ref={settingsRef} style={{}}>
            <IconButton
                aria-label="settings"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className={styles.iconButton}
            >
                <SettingsIcon
                    className={styles.settingsIcon}
                    sx={{
                        fontSize: '2rem',
                        color: palette.primary.contrastText,
                    }}
                />
            </IconButton>
            <Menu
                className={styles.settingsMenu}
                disablePortal={true}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={{
                    '.MuiPaper-root': {
                        overflow: 'visible',
                        height: 'fit-content',
                        width: 'fit-content',
                        maxHeight: 'max-content',
                        maxWidth: 'max-content',
                        minWidth: 'min-content',
                        minHeight: 'min-content',
                    },
                }}
            >
                <MenuItem onClick={handleAnimationsItem}>
                    Animations:{' '}
                    {ANIMATION_PREF_STRINGS[userPrefs.animationLevel]}
                </MenuItem>
                <MenuItem onClick={handleThemeItem}>
                    Theme: {palette.mode}
                </MenuItem>
                <MenuItem onClick={handleTemperatureItem}>
                    Temperature Unit: {userPrefs.temperatureUnit}
                </MenuItem>
                <MenuItem onClick={handleWindSpeedItem}>
                    Wind Speed Unit: {userPrefs.windUnit}
                </MenuItem>
                <MenuItem onClick={handlePrecipitationItem}>
                    Precipitation Unit: {userPrefs.precipitationUnit}
                </MenuItem>
            </Menu>
        </div>
    )
}

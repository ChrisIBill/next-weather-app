'use client'

import SettingsIcon from '@mui/icons-material/Settings'
import styles from './settings.module.css'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import getUserPreferences, { UserPreferencesInterface } from '@/lib/user'

interface Preferences {
    TempUnit: 'Fahrenheit' | 'Celsius' | 'Kelvin'
    WindSpeedUnit: 'Mph' | 'Kph' | 'Mps'
    PrecipitationUnit: 'in' | 'mm' | 'cm'
}

export default function Settings() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const [userPrefs, setUserPrefs] = React.useState<Preferences>({
        TempUnit: 'Fahrenheit',
        WindSpeedUnit: 'Mph',
        PrecipitationUnit: 'in',
    })

    console.log(userPrefs)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleTemperatureItem = () => {
        localStorage.setItem('tempUnit', 'Celsius')
        handleClose()
    }

    return (
        <div className={styles.settingsWrapper}>
            <IconButton aria-label="settings" onClick={handleClick}>
                <SettingsIcon />
            </IconButton>
            <Menu
                className={styles.settingsMenu}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Animations</MenuItem>
                <MenuItem onClick={handleTemperatureItem}>
                    Temperature Unit:{' '}
                    {userPrefs.TempUnit ? userPrefs.TempUnit : 'Fahrenheit'}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    {userPrefs.PrecipitationUnit
                        ? userPrefs.PrecipitationUnit
                        : 'in'}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    {userPrefs.WindSpeedUnit ? userPrefs.WindSpeedUnit : 'Mph'}
                </MenuItem>
            </Menu>
        </div>
    )
}

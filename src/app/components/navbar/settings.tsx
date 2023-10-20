'use client'

import SettingsIcon from '@mui/icons-material/Settings'
import styles from './settings.module.css'
import { Menu, MenuItem } from '@mui/material'
import React from 'react'

export default function Settings() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const User = {
        preferences: {
            tempUnit: localStorage.getItem('tempUnit') || 'Fahrenheit',
            windSpeedUnit: localStorage.getItem('windSpeedUnit') || 'Mph',
            precipitationUnit:
                localStorage.getItem('precipitationUnit') || 'in',
        },
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className={styles.settingsButton}>
            <SettingsIcon onClick={handleClick} />
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
                <MenuItem onClick={handleClose}>
                    {User.preferences.tempUnit}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    {User.preferences.windSpeedUnit}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    {User.preferences.precipitationUnit}
                </MenuItem>
            </Menu>
        </div>
    )
}

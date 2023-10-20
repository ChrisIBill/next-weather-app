'use client'

import SettingsIcon from '@mui/icons-material/Settings'
import styles from './settings.module.css'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import UserPrefs, {
    MeasurementUnits,
    TemperatureUnitType,
    PrecipitationUnitType,
    WindSpeedUnitType,
} from '@/lib/user'

interface Preferences {
    TempUnit: 'Fahrenheit' | 'Celsius' | 'Kelvin'
    WindSpeedUnit: 'Mph' | 'Kph' | 'Mps'
    PrecipitationUnit: 'in' | 'mm' | 'cm'
}

export default function Settings() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const tempUnits = MeasurementUnits.TemperatureUnits
    const windUnits = MeasurementUnits.WindSpeedUnits
    const precipUnits = MeasurementUnits.PrecipitationUnits

    const [tempPref, setTempPref] =
        React.useState<TemperatureUnitType>('Fahrenheit')
    const [windPref, setWindPref] = React.useState<WindSpeedUnitType>('Mph')
    const [precipPref, setPrecipPref] =
        React.useState<PrecipitationUnitType>('in')

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleTemperatureItem = () => {
        switch (tempPref) {
            case tempUnits[0]: {
                setTempPref(tempUnits[1])
                break
            }
            case tempUnits[1]: {
                setTempPref(tempUnits[2])
                break
            }
            case tempUnits[2]: {
                setTempPref(tempUnits[0])
                break
            }
        }
    }
    const handleWindSpeedItem = () => {
        switch (windPref) {
            case windUnits[0]: {
                setWindPref(windUnits[1])
                break
            }
            case windUnits[1]: {
                setWindPref(windUnits[2])
                break
            }
            case windUnits[2]: {
                setWindPref(windUnits[0])
                break
            }
        }
    }
    const handlePrecipitationItem = () => {
        switch (precipPref) {
            case precipUnits[0]: {
                setPrecipPref(precipUnits[1])
                break
            }
            case precipUnits[1]: {
                setPrecipPref(precipUnits[2])
                break
            }
            case precipUnits[2]: {
                setPrecipPref(precipUnits[0])
                break
            }
        }
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
                    Temperature Unit: {tempPref}
                </MenuItem>
                <MenuItem onClick={handleWindSpeedItem}>
                    Wind Speed Unit: {windPref}
                </MenuItem>
                <MenuItem onClick={handlePrecipitationItem}>
                    Precipitation Unit: {precipPref}
                </MenuItem>
            </Menu>
        </div>
    )
}

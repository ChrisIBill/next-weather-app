'use client'

import SettingsIcon from '@mui/icons-material/Settings'
import styles from './settings.module.css'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import UserPrefs, {
    MeasurementUnits,
    TemperatureUnitType,
    PrecipitationUnitType,
    WindSpeedUnitType,
    UserPreferencesInterface,
} from '@/lib/user'

interface Preferences {
    TempUnit: 'Fahrenheit' | 'Celsius' | 'Kelvin'
    WindSpeedUnit: 'Mph' | 'Kph' | 'Mps'
    PrecipitationUnit: 'in' | 'mm' | 'cm'
}

export interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}: SettingsProps) => {
    const User = new UserPrefs()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const tempUnits = MeasurementUnits.TemperatureUnits
    const windUnits = MeasurementUnits.WindSpeedUnits
    const precipUnits = MeasurementUnits.PrecipitationUnits

    const [tempPref, setTempPref] = React.useState<TemperatureUnitType>(
        User.tempUnit ? User.tempUnit : 'Fahrenheit'
    )
    const [windPref, setWindPref] = React.useState<WindSpeedUnitType>(
        User.windSpeedUnit ? User.windSpeedUnit : 'Mph'
    )
    const [precipPref, setPrecipPref] = React.useState<PrecipitationUnitType>(
        User.precipitationUnit ? User.precipitationUnit : 'in'
    )

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        User.setTempUnit(tempPref)
        User.setWindSpeedUnit(windPref)
        User.setPrecipitationUnit(precipPref)
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
        //User.setTempUnit(tempPref)
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
        //User.setWindSpeedUnit(windPref)
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
        //User.setPrecipitationUnit(precipPref)
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

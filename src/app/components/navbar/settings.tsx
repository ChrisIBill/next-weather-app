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
import { stringLiteralGenerator } from '@/lib/lib'
import { palette } from '@/lib/color'

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
    const tempGenerator = stringLiteralGenerator(tempPref, tempUnits)
    const windGenerator = stringLiteralGenerator(windPref, windUnits)
    const precipGenerator = stringLiteralGenerator(precipPref, precipUnits)

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
        setTempPref(tempGenerator.next().value as TemperatureUnitType)
    }
    const handleWindSpeedItem = () => {
        setWindPref(windGenerator.next().value as WindSpeedUnitType)
    }
    const handlePrecipitationItem = () => {
        setPrecipPref(precipGenerator.next().value as PrecipitationUnitType)
    }

    return (
        <div className={styles.settingsWrapper}>
            <IconButton aria-label="settings" onClick={handleClick}>
                <SettingsIcon
                    sx={{
                        fontSize: '2rem',
                        color: palette.offWhite,
                    }}
                />
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

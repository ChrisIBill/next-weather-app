'use client'

import SettingsIcon from '@mui/icons-material/Settings'
import styles from './navbar.module.scss'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import UserPrefs, {
    ContextUnits,
    TemperatureUnitType,
    PrecipitationUnitType,
    WindSpeedUnitType,
    UserPreferencesInterface,
    TemperatureEnum,
} from '@/lib/user'
import { stringLiteralGenerator } from '@/lib/lib'
import palette from '@/lib/export.module.scss'
import { useTheme, useUser } from '@/lib/context'
import paletteHandler from '@/lib/paletteHandler'

interface Preferences {
    TempUnit: 'Fahrenheit' | 'Celsius' | 'Kelvin'
    WindSpeedUnit: 'Mph' | 'Kph' | 'Mps'
    PrecipitationUnit: 'in' | 'mm' | 'cm'
}

export interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}: SettingsProps) => {
    const [User, setUser] = [useUser().user, useUser().setUser]
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const [reload, setReload] = React.useState<boolean>(false)

    const theme = useTheme()
    const palette = paletteHandler(theme.theme)

    const tempUnits = ContextUnits.TemperatureUnits
    const windUnits = ContextUnits.WindSpeedUnits
    const precipUnits = ContextUnits.PrecipitationUnits
    const themeTypes = ContextUnits.ThemeTypes

    const [tempPref, setTempPref] = React.useState<TemperatureUnitType>(
        User.tempUnit ? User.tempUnit : TemperatureEnum.fahrenheit
    )
    const [windPref, setWindPref] = React.useState<WindSpeedUnitType>(
        User.windSpeedUnit ? User.windSpeedUnit : 'mph'
    )
    const [precipPref, setPrecipPref] = React.useState<PrecipitationUnitType>(
        User.precipitationUnit ? User.precipitationUnit : 'inch'
    )
    const tempGenerator = stringLiteralGenerator(tempPref, tempUnits)
    const windGenerator = stringLiteralGenerator(windPref, windUnits)
    const precipGenerator = stringLiteralGenerator(precipPref, precipUnits)
    const themeGenerator = stringLiteralGenerator(theme.theme, themeTypes)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setUser({
            tempUnit: tempPref,
            windSpeedUnit: windPref,
            precipitationUnit: precipPref,
            reload: true,
            themePrefs: theme.theme,
        })
        setAnchorEl(null)
    }

    const handleTemperatureItem = () => {
        setTempPref(tempGenerator.next().value as TemperatureUnitType)
        setReload(true)
    }
    const handleWindSpeedItem = () => {
        setWindPref(windGenerator.next().value as WindSpeedUnitType)
        setReload(true)
    }
    const handlePrecipitationItem = () => {
        setPrecipPref(precipGenerator.next().value as PrecipitationUnitType)
        setReload(true)
    }
    const handleThemeItem = () => {
        theme.setTheme(themeGenerator.next().value as 'light' | 'dark')
    }

    return (
        <div className={styles.settingsWrapper}>
            <IconButton aria-label="settings" onClick={handleClick}>
                <SettingsIcon
                    sx={{
                        fontSize: '2rem',
                        color: palette.textPrimary,
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
                <MenuItem onClick={handleThemeItem}>
                    Theme: {theme.theme}
                </MenuItem>
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

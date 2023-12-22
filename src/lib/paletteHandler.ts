import { PaletteMode, createTheme } from '@mui/material'
import impPalette from './export.module.scss'
export default function paletteHandler(theme?: string) {
    if (theme === 'dark')
        return {
            primary: impPalette.darkPrimary,
            background: impPalette.darkBackground,
            secondary: impPalette.darkSecondary,
            textPrimary: impPalette.darkTextPrimary,
            textSecondary: impPalette.darkTextSecondary,
            accent: impPalette.darkAccent,
            accentSecondary: impPalette.darkAccentSecondary,
        }
    return {
        primary: impPalette.lightPrimary,
        background: impPalette.lightBackground,
        secondary: impPalette.lightSecondary,
        textPrimary: impPalette.lightTextPrimary,
        textSecondary: impPalette.lightTextSecondary,
        accent: impPalette.lightAccent,
        accentSecondary: impPalette.lightAccentSecondary,
    }
}

const empty_palette = createTheme()

export const getPaletteMode = (mode: PaletteMode) => ({
    typography: {
        fontFamily: 'Roboto, Roboto_Slab, sans-serif',
    },
    palette: {
        mode,
        contrastThreshold: 4.5,
        morningHorizon: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.morningHorizon,
            },
            name: 'morningHorizon',
        }),
        morningSky: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.morningSky,
            },
            name: 'morningSky',
        }),
        dayHorizon: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.dayHorizon,
            },
            name: 'dayHorizon',
        }),
        daySky: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.daySky,
            },
            name: 'daySky',
        }),
        eveningHorizon: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.eveningHorizon,
            },
            name: 'eveningHorizon',
        }),
        eveningSky: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.eveningSky,
            },
            name: 'eveningSky',
        }),
        nightHorizon: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.nightHorizon,
            },
            name: 'nightHorizon',
        }),
        nightSky: empty_palette.palette.augmentColor({
            color: {
                main: impPalette.nightSky,
            },
            name: 'nightSky',
        }),
        ...(mode === 'light'
            ? {
                  primary: {
                      main: impPalette.lightPrimary,
                  },
                  secondary: {
                      main: impPalette.lightSecondary,
                  },
                  blue: {
                      main: impPalette.lightBlue,
                  },
                  violet: {
                      main: '#7c4dff',
                  },
                  textPrimary: impPalette.lightTextPrimary,
                  textSecondary: impPalette.lightTextSecondary,
                  textDarkPrimary: impPalette.darkTextPrimary,
                  textDarkSecondary: impPalette.darkTextSecondary,
              }
            : {
                  primary: {
                      main: impPalette.darkPrimary,
                  },
                  secondary: {
                      main: impPalette.darkSecondary,
                  },
                  blue: {
                      main: impPalette.darkBlue,
                  },
                  violet: {
                      main: impPalette.darkViolet,
                  },
                  textPrimary: impPalette.darkTextPrimary,
                  textSecondary: impPalette.darkTextSecondary,
                  textLightPrimary: impPalette.lightTextPrimary,
                  textLightSecondary: impPalette.lightTextSecondary,
              }),
    },
})

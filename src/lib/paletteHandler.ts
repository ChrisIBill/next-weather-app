import { PaletteMode } from '@mui/material'
import palette from './export.module.scss'
export default function paletteHandler(theme?: string) {
    if (theme === 'dark')
        return {
            primary: palette.darkPrimary,
            background: palette.darkBackground,
            secondary: palette.darkSecondary,
            textPrimary: palette.darkTextPrimary,
            textSecondary: palette.darkTextSecondary,
            accent: palette.darkAccent,
            accentSecondary: palette.darkAccentSecondary,
        }
    return {
        primary: palette.lightPrimary,
        background: palette.lightBackground,
        secondary: palette.lightSecondary,
        textPrimary: palette.lightTextPrimary,
        textSecondary: palette.lightTextSecondary,
        accent: palette.lightAccent,
        accentSecondary: palette.lightAccentSecondary,
    }
}

export const getPaletteMode = (mode: PaletteMode) => ({
    palette: {
        mode,
        contrastThreshold: 4.5,
        ...(mode === 'light'
            ? {
                  primary: {
                      main: palette.lightPrimary,
                  },
                  secondary: {
                      main: palette.lightSecondary,
                  },
                  blue: {
                      main: palette.lightBlue,
                  },
                  violet: {
                      main: '#7c4dff',
                  },
                  textPrimary: palette.lightTextPrimary,
                  textSecondary: palette.lightTextSecondary,
                  textDarkPrimary: palette.darkTextPrimary,
                  textDarkSecondary: palette.darkTextSecondary,
              }
            : {
                  primary: {
                      main: palette.darkPrimary,
                  },
                  secondary: {
                      main: palette.darkSecondary,
                  },
                  blue: {
                      main: palette.darkBlue,
                  },
                  violet: {
                      main: palette.darkViolet,
                  },
                  textPrimary: palette.darkTextPrimary,
                  textSecondary: palette.darkTextSecondary,
                  textLightPrimary: palette.lightTextPrimary,
                  textLightSecondary: palette.lightTextSecondary,
              }),
    },
})

import palette from './export.module.scss'
export default function paletteHandler(theme?: string) {
    if (theme === 'dark')
        return {
            background: palette.darkBackground,
            secondary: palette.darkSecondary,
            textPrimary: palette.darkTextPrimary,
            textSecondary: palette.darkTextSecondary,
            accent: palette.darkAccent,
            accentSecondary: palette.darkAccentSecondary,
        }
    return {
        background: palette.lightBackground,
        secondary: palette.lightSecondary,
        textPrimary: palette.lightTextPrimary,
        textSecondary: palette.lightTextSecondary,
        accent: palette.lightAccent,
        accentSecondary: palette.lightAccentSecondary,
    }
}

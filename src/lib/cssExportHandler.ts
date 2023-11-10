import palette from './export.module.scss'
function paletteHandler() {
    if (typeof window === 'undefined')
        throw new Error(
            'Client-side function paletteHandler() running on server-side'
        )
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return {
            background: palette.darkBackground,
            secondary: palette.darkSecondary,
            textPrimary: palette.darkTextPrimary,
            textSecondary: palette.darkTextSecondary,
            accent: palette.darkAccent,
        }
    }
    return {
        background: palette.lightBackground,
        secondary: palette.lightSecondary,
        textPrimary: palette.lightTextPrimary,
        textSecondary: palette.lightTextSecondary,
        accent: palette.lightAccent,
    }
}

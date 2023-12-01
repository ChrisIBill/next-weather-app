import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface Palette {
        morningHorizon: Palette['primary']
        morningSky: Palette['primary']
        dayHorizon: Palette['primary']
        daySky: Palette['primary']
        eveningHorizon: Palette['primary']
        eveningSky: Palette['primary']
        nightHorizon: Palette['primary']
        nightSky: Palette['primary']
    }
    interface PaletteOptions {
        morningHorizon: PaletteOptions['primary']
        morningSky: PaletteOptions['primary']
        dayHorizon: PaletteOptions['primary']
        daySky: PaletteOptions['primary']
        eveningHorizon: PaletteOptions['primary']
        eveningSky: PaletteOptions['primary']
        nightHorizon: PaletteOptions['primary']
        nightSky: PaletteOptions['primary']
    }
}

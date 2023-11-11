import React from 'react'
import styles from './page.module.scss'
import { getDateObject } from '@/lib/time'
import { Typography } from '@mui/material'
import paletteHandler from '@/lib/paletteHandler'
import { useTheme } from '@/lib/context'
export interface WeatherPageHeaderProps {
    time?: string
}
export const WeatherPageHeader: React.FC<WeatherPageHeaderProps> = (
    props: WeatherPageHeaderProps
) => {
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)
    if (!props.time)
        return (
            <div className={styles.headerWrapper}>
                Loading Weather Page Header
            </div>
        )
    const date = getDateObject(props.time)
    return (
        <div
            className={styles.headerWrapper}
            data-theme={theme.theme}
            style={{
                color: palette.textPrimary,
            }}
        >
            <Typography
                variant="h2"
                component="h2"
                className={styles.headerText}
                sx={{
                    fontWeight: 'lighter',
                }}
            >
                {date.format('dddd')}
            </Typography>
            <Typography
                variant="h3"
                component="h3"
                className={styles.headerText}
                sx={{
                    fontWeight: 'lighter',
                }}
            >
                {date.format('MMMM D')}
            </Typography>
            <Typography
                variant="h4"
                component="h4"
                className={styles.headerText}
                sx={{
                    fontWeight: 'lighter',
                    color: palette.textSecondary,
                }}
            >
                {date.format('h:mm A')}
            </Typography>
            {/*<div className={styles.headerContrastLayer} />*/}
        </div>
    )
}

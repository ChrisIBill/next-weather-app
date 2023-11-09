import React from 'react'
import styles from './page.module.css'
import { getDateObject } from '@/lib/time'
import { Typography } from '@mui/material'
import { palette } from '@/lib/color'
export interface WeatherPageHeaderProps {
    time?: string
}
export const WeatherPageHeader: React.FC<WeatherPageHeaderProps> = (
    props: WeatherPageHeaderProps
) => {
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
            style={{
                color: palette.offWhite,
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
                }}
            >
                {date.format('h:mm A')}
            </Typography>
            <div className={styles.headerContrastLayer} />
        </div>
    )
}
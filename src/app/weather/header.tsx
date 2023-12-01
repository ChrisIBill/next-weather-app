import React from 'react'
import styles from './page.module.scss'
import { TimeObjectType, getDateObject } from '@/lib/time'
import { Typography } from '@mui/material'
import paletteHandler from '@/lib/paletteHandler'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import { useBackgroundColors } from '../components/background/dayNightColorLayer'

export interface WeatherPageHeaderProps {
    timeObj: TimeObjectType
}
export const WeatherPageHeader: React.FC<WeatherPageHeaderProps> = (
    props: WeatherPageHeaderProps
) => {
    const palette = useTheme().palette

    const backgroundColor = useBackgroundColors()[props.timeObj.timeOfDay!].sky
    console.log('bgcolor: ', backgroundColor)
    if (typeof props.timeObj.time === 'undefined')
        return (
            <div className={styles.headerWrapper}>
                Loading Weather Page Header
            </div>
        )

    const date =
        typeof props.timeObj.time === 'string'
            ? getDateObject(props.timeObj.time)
            : props.timeObj.time
    return (
        <div
            className={styles.headerWrapper}
            data-theme={palette.mode}
            style={{
                color: palette.getContrastText(backgroundColor),
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
                {props.timeObj.time.includes('T')
                    ? date.format('h:mm A')
                    : date.format('M-D YYYY')}
            </Typography>
            {/*<div className={styles.headerContrastLayer} />*/}
        </div>
    )
}

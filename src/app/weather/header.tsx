import React from 'react'
import styles from './page.module.css'
import { getDateObject } from '@/lib/time'
import { Typography } from '@mui/material'
export interface WeatherPageHeaderProps {
    time?: string
}
export const WeatherPageHeader: React.FC<WeatherPageHeaderProps> = (
    props: WeatherPageHeaderProps
) => {
    if (!props.time) return <div>Loading Weather Page Header</div>
    const date = getDateObject(props.time)
    return (
        <div className={styles.headerWrapper}>
            <Typography
                variant="h2"
                component="h2"
                sx={{
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 'lighter',
                }}
            >
                {date.format('dddd')}
            </Typography>
            <Typography
                variant="h3"
                component="h3"
                sx={{
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 'lighter',
                }}
            >
                {date.format('MMMM D')}
            </Typography>
        </div>
    )
}

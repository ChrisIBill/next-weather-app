import React, { useEffect, useCallback } from 'react'
import styles from './background.module.scss'
import { DayNightColorLayer } from './dayNightColorLayer'
import { CelestialIconsHandler } from './celestialIcons'
import {
    TimeObjectType,
    clockTimeToMinutes,
    dayLengthCalculator,
} from '@/lib/time'
import RainBackground from '@/app/rain'
import { DetailedWeatherDataType } from '@/lib/interfaces'
import { calcPercentOfDayNight } from '@/lib/time'
import { Clouds } from './clouds'
import { useTheme } from '@mui/material/styles'
import { useWindowDimensions } from '@/lib/hooks'

export interface BackgroundProps {
    weatherForecast?: DetailedWeatherDataType
    timeObj?: TimeObjectType
    isCard?: boolean
}

export const Background: React.FC<BackgroundProps> = (
    props: BackgroundProps
) => {
    const ref = React.useRef<HTMLDivElement>(null)

    const forecast = props.weatherForecast
    const cloudCover = forecast
        ? forecast.cloudcover !== undefined
            ? forecast.cloudcover
            : forecast.avg_daily_cloudcover !== undefined
            ? forecast.avg_daily_cloudcover
            : 50
        : 50

    return (
        <div
            className={styles.wrapper}
            ref={ref}
            style={{
                top: props.isCard ? '0' : '-4rem',
            }}
        >
            <Clouds
                cloudCover={cloudCover as number}
                size={props.isCard ? 'small' : ''}
                isCard={props.isCard}
            />
            <ClockworkBackgroundComponents
                isCard={props.isCard}
                timeObj={props.timeObj}
            />
            {/*
            <RainBackground />
            <CelestialIconsHandler isDay={isDay} timePercent={timePercent} />
            <DayNightColorLayer isDay={isDay} timePercent={timePercent} />
            */}
        </div>
    )
}

interface ClockworkProps {
    isCard?: boolean
    timeObj?: TimeObjectType
}
const ClockworkBackgroundComponents: React.FC<ClockworkProps> = (
    props: ClockworkProps
) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const palette = useTheme().palette
    const timeObj = props.timeObj
        ? props.timeObj
        : {
              isDay: palette.mode === 'dark' ? false : true,
              timePercent: 0.5,
              timeOfDay: palette.mode === 'dark' ? 'night' : 'day',
          }

    return (
        <div className={styles.clockworkWrapper} ref={ref}>
            <CelestialIconsHandler
                timeObj={timeObj}
                parentRef={ref}
                isCard={props.isCard}
            />
            <DayNightColorLayer timeObj={timeObj} />
        </div>
    )
}

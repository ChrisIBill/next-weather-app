import React, { useEffect, useCallback } from 'react'
import styles from './background.module.scss'
import { DayNightColorLayer } from './dayNightColorLayer'
import { CelestialIconsHandler } from './celestialIcons'
import { clockTimeToMinutes, dayLengthCalculator } from '@/lib/time'
import RainBackground from '@/app/rain'
import { DetailedWeatherDataType } from '@/lib/interfaces'
import { calcPercentOfDayNight } from '@/lib/time'
import { Clouds } from './clouds'
import { useTheme } from '@/lib/context'

export interface BackgroundProps {
    weatherForecast?: DetailedWeatherDataType
    isCard?: boolean
}
export const Background: React.FC<BackgroundProps> = (
    props: BackgroundProps
) => {
    const [height, setHeight] = React.useState<number>(0)
    const [width, setWidth] = React.useState<number>(0)
    const ref = React.useRef<HTMLDivElement>(null)

    const forecast = props.weatherForecast
    const cloudCover = forecast
        ? forecast.cloudcover !== undefined
            ? forecast.cloudcover
            : forecast.avg_daily_cloudcover !== undefined
            ? forecast.avg_daily_cloudcover
            : 50
        : 50

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight)
            setWidth(ref.current.clientWidth)
        }
    }, [ref])

    return (
        <div className={styles.wrapper} ref={ref}>
            <Clouds
                cloudCover={cloudCover as number}
                size={props.isCard ? 'small' : ''}
            />
            <ClockworkBackgroundComponents
                isCard={props.isCard}
                time={props.weatherForecast?.time?.split('T')[1]}
                sunrise={props.weatherForecast?.sunrise?.split('T')[1]}
                sunset={props.weatherForecast?.sunset?.split('T')[1]}
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
    time?: string
    sunrise?: string
    sunset?: string
}
const ClockworkBackgroundComponents: React.FC<ClockworkProps> = (
    props: ClockworkProps
) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const theme = useTheme().theme
    let timeObj = {
        isDay: theme === 'dark' ? false : true,
        timePercent: 0.5,
    }
    //const [curTimeMin, sunriseMin, sunsetMin]
    if (!props.isCard) {
        const curTimeMinutes = props.time ? clockTimeToMinutes(props.time) : 900
        const sunriseMinutes = props.sunrise
            ? clockTimeToMinutes(props.sunrise)
            : 360
        const sunsetMinutes = props.sunset
            ? clockTimeToMinutes(props.sunset)
            : 1080

        const dayLength =
            props.sunrise && props.sunset
                ? dayLengthCalculator(sunriseMinutes, sunsetMinutes)
                : 720
        timeObj = calcPercentOfDayNight(
            curTimeMinutes,
            sunriseMinutes,
            sunsetMinutes,
            dayLength
        )
    }
    return (
        <div className={styles.wrapper} ref={ref}>
            <CelestialIconsHandler
                isDay={timeObj.isDay}
                timePercent={timeObj.timePercent}
                parentRef={ref}
                isCard={props.isCard}
            />
            <DayNightColorLayer
                isDay={timeObj.isDay}
                timePercent={timeObj.timePercent}
            />
        </div>
    )
}

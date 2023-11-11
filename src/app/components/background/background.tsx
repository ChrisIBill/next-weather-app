import React from 'react'
import styles from './background.module.css'
import { DayNightColorLayer } from './dayNightColorLayer'
import { CelestialIconsHandler } from './celestialIcons'
import { clockTimeToMinutes, dayLengthCalculator } from '@/lib/time'
import RainBackground from '@/app/rain'
import { DetailedWeatherDataType } from '@/lib/interfaces'
import { calcPercentOfDayNight } from '@/lib/time'
import { Clouds } from './clouds'

export interface BackgroundProps {
    weatherForecast?: DetailedWeatherDataType
    theme?: string
}
export const Background: React.FC<BackgroundProps> = (
    props: BackgroundProps
) => {
    if (!props.weatherForecast?.time) {
        //TODO:
        //Need to return a default background
        return (
            <div className={styles.wrapper}>
                <RainBackground />
            </div>
        )
    }
    const [date, time] = props.weatherForecast?.time.split('T')
    //TODO: need better handling of this
    if (!time) return <div className={styles.wrapper}></div>

    const sunrise = props.weatherForecast?.sunrise?.split('T')[1]
    const sunset = props.weatherForecast?.sunset?.split('T')[1]

    const curTimeMinutes = clockTimeToMinutes(time)
    const sunriseMinutes = sunrise ? clockTimeToMinutes(sunrise) : 360
    const sunsetMinutes = sunset ? clockTimeToMinutes(sunset) : 1080

    const dayLength =
        sunrise && sunset
            ? dayLengthCalculator(sunriseMinutes, sunsetMinutes)
            : 720
    const { isDay, timePercent } = calcPercentOfDayNight(
        curTimeMinutes,
        sunriseMinutes,
        sunsetMinutes,
        dayLength
    )
    console.log('Day calcs: ', isDay, timePercent)
    return (
        <div className={styles.wrapper}>
            {/*<Clouds cloudCover={100} />
                            <RainBackground />

            <CelestialIconsHandler
                isDay={isDay}
                timePercent={timePercent}
            />
            <DayNightColorLayer isDay={isDay} timePercent={timePercent} /> */}
        </div>
    )
}

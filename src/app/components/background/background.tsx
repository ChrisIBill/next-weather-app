import React from 'react'
import styles from './background.module.css'
import { DayNightColorLayer } from './dayNightColorLayer'
import { CelestialIconsHandler } from './celestialIcons'
import { clockTimeToMinutes, dayLengthCalculator } from '@/lib/lib'
import RainBackground from '@/app/rain'
import { DetailedWeatherDataType } from '@/lib/interfaces'

/**
 * @description Calculates the percentage of the day/night that has passed.
 *
 * @param {number} curTime - [Current time in minutes]
 * @param {number} sunrise - [Sunrise time in minutes]
 * @param {number} sunset - [Sunset time in minutes]
 * @param {number} dayLength - [length of day in minutes]
 * @returns {number} [Number ranging from -1 to 1, with negatives representing night percentage]
 */
function calcPercentOfDayNight(
    curTime: number,
    sunrise: number,
    sunset: number,
    dayLength: number
): { isDay: boolean; timePercent: number } {
    //In standard time, night is from 6pm to 6am, or 18 to 6
    const nightLength = 1440 - dayLength

    if (curTime < sunrise) {
        //Time after sunset but before midnight
        const eveningTime = nightLength - sunrise
        const nightPercent = (eveningTime + curTime) / nightLength
        return { isDay: false, timePercent: nightPercent }
    } else if (curTime > sunset) {
        const timeAfterSunset = curTime - sunset
        const nightPercent = timeAfterSunset / nightLength
        return { isDay: false, timePercent: nightPercent }
    } else {
        //should be daytime
        const timeSinceSunrise = curTime - sunrise
        const dayPercent = timeSinceSunrise / dayLength
        return { isDay: true, timePercent: dayPercent }
    }
}

export interface BackgroundProps {
    weatherForecast?: DetailedWeatherDataType
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
            <CelestialIconsHandler isDay={isDay} timePercent={timePercent} />
            <DayNightColorLayer isDay={isDay} timePercent={timePercent} />
        </div>
    )
}

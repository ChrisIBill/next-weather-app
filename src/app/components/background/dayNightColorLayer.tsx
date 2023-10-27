//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import {
    clockTimeToMinutes,
    dayLengthCalculator,
    numberToHourString,
} from '@/lib/lib'
import styles from './dayNightColorLayer.module.css'
import { CelestialIconsHandler } from './celestialIcons'

export interface ColorLayerProps {
    time: string
    sunrise?: string
    sunset?: string
}

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
        console.log('nightPercent', nightPercent)
        return { isDay: false, timePercent: nightPercent }
    } else if (curTime > sunset) {
        const timeAfterSunset = curTime - sunset
        const nightPercent = timeAfterSunset / nightLength
        console.log('nightPercent', nightPercent)
        return { isDay: false, timePercent: nightPercent }
    } else {
        //should be daytime
        console.info('Good Day')
        const timeSinceSunrise = curTime - sunrise
        const dayPercent = timeSinceSunrise / dayLength
        console.log('dayPercent', dayPercent)
        return { isDay: true, timePercent: dayPercent }
    }
}
/**
 * Maps percentage of day/night to a number between 0 and 23
 *
 * @param {boolean} isDay - [TODO:description]
 * @param {number} percent - [TODO:description]
 * @returns {string} [TODO:description]
 */
function percentToGradientStringMapper(
    isDay: boolean,
    percent: number
): string {
    //Maps a number ranging from 0 to 1 to a number ranging from 0 to 11
    //This is used to select the appropriate color gradient
    if (isDay) return numberToHourString(Math.round(percent * 11) + 7)
    else return numberToHourString((Math.round(percent * 11) + 19) % 24)
}

export const DayNightColorLayer: React.FC<ColorLayerProps> = ({
    time,
    sunrise,
    sunset,
}: ColorLayerProps) => {
    //minutes in day = 1440
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
    const gradientHour = percentToGradientStringMapper(isDay, timePercent)
    const dayNightColorStyle = `dayNightColorGradient${gradientHour}`
    return (
        <div className={styles.wrapper}>
            <CelestialIconsHandler isDay={isDay} timePercent={timePercent} />
            <div
                id={styles.dayNightColorLayer}
                className={styles[dayNightColorStyle]}
            ></div>
        </div>
    )
}

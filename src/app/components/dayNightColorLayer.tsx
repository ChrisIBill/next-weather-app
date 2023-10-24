//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { clockTimeToMinutes } from '@/lib/lib'
import styles from './dayNightColorLayer.module.css'

export interface ColorLayerProps {
    time: string
    sunrise?: string
    sunset?: string
}

function dayLengthCalculator(
    sunriseMinutes: number,
    sunsetMinutes: number
): number {
    const dayLength =
        sunriseMinutes > sunsetMinutes
            ? 1440 - sunriseMinutes + sunsetMinutes
            : sunsetMinutes - sunriseMinutes
    if (sunsetMinutes > sunriseMinutes) return sunsetMinutes - sunriseMinutes
    else return 1440 - sunriseMinutes + sunsetMinutes
}
function calcDayNightColorGradient(
    curTime: number,
    sunrise: number,
    sunset: number,
    dayLength: number
) {
    //calculates the percentage of the day that has passed, and returns a number between 6 and 18
    //or if before sunrise or after sunset, returns a number between 0 and 6 or 18 and 24
    if (curTime < sunrise) {
        console.log('is before sunrise')
        const timeBeforeSunrise = sunrise - curTime
        return Math.round((timeBeforeSunrise / dayLength) * 6)
    } else if (curTime > sunset) {
        console.log('is after sunset')
        const timeAfterSunset = curTime - sunset
        return Math.round((timeAfterSunset / dayLength) * 6) + 18
    } else {
        //is daytime
        console.log('is daytime')
        const timeSinceSunrise = curTime - sunrise
        return Math.round((timeSinceSunrise / dayLength) * 12) + 6
    }
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
    const [shortTime, date] = time.split('T')
    console.log('sunrise: ', sunrise)
    console.log('sunset: ', sunset)

    const dayLength =
        sunrise && sunset
            ? dayLengthCalculator(sunriseMinutes, sunsetMinutes)
            : 600
    console.log('Length of day: ', dayLength)

    const gradientHour = calcDayNightColorGradient(
        curTimeMinutes,
        sunriseMinutes,
        sunsetMinutes,
        dayLength
    )
    const dayNightColorStyle = `dayNightColorGradient${gradientHour}`
    console.log('gradientHour: ', dayNightColorStyle)
    const className = styles[dayNightColorStyle + gradientHour]
    return (
        <div className={styles.wrapper}>
            <div
                id={styles.dayNightColorLayer}
                className={styles[dayNightColorStyle]}
            >
                {dayNightColorStyle}
            </div>
        </div>
    )
}

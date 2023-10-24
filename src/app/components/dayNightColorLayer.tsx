//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { clockTimeToMinutes } from '@/lib/lib'
import styles from './dayNightColorLayer.module.css'

export interface ColorLayerProps {
    time: string
    sunrise: string
    sunset: string
}

function dayLengthCalculator(sunrise: string, sunset: string): number {
    const [sunriseMinutes, sunsetMinutes] = [sunrise, sunset].map((time) =>
        clockTimeToMinutes(time)
    )
    if (sunsetMinutes > sunriseMinutes) return sunsetMinutes - sunriseMinutes
    else return 1440 - sunriseMinutes + sunsetMinutes
}
export const DayNightColorLayer: React.FC<ColorLayerProps> = ({
    time,
    sunrise,
    sunset,
}: ColorLayerProps) => {
    const [shortTime, date] = time.split('T')
    const sunriseTime = sunrise.split('T')[1]
    const sunsetTime = sunset.split('T')[1]
    const dayNightColorStyle = 'dayNightColorGradient' + shortTime.slice(0, 2)

    console.log('Day night color layer')

    const dayLength = dayLengthCalculator(sunriseTime, sunsetTime)
    const className = styles[dayNightColorStyle]
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

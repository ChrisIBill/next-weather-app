//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { numberToHourString } from '@/lib/lib'
import styles from './dayNightColorLayer.module.css'

export interface ColorLayerProps {
    isDay: boolean
    timePercent: number
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
    isDay,
    timePercent,
}: ColorLayerProps) => {
    //minutes in day = 1440

    const gradientHour = percentToGradientStringMapper(isDay, timePercent)
    const dayNightColorStyle = `dayNightColorGradient${gradientHour}`
    return (
        <div
            id={styles.dayNightColorLayer}
            className={styles[dayNightColorStyle]}
        ></div>
    )
}

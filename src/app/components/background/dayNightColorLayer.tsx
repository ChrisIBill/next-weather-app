//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import styles from './dayNightColorLayer.module.css'
import { percentToGradientStringMapper } from '@/lib/time'

export interface ColorLayerProps {
    isDay: boolean
    timePercent: number
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

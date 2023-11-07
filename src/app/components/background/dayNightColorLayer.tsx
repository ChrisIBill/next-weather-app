//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import styles from './dayNightColorLayer.module.scss'
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
    console.log('DayNightColorLayer: ', isDay, timePercent)

    const gradientHour = percentToGradientStringMapper(isDay, timePercent)
    const dayNightColorStyle = `dayNightColorGradient${gradientHour}`
    return (
        <div
            id={styles.dayNightColorLayer}
            className={styles[dayNightColorStyle]}
        >
            {isDay ? <></> : <StarryNightBackground />}
        </div>
    )
}

export const StarryNightBackground: React.FC = () => {
    return (
        <div className={styles.starsWrapper}>
            <Stars num={200} />
        </div>
    )
}

export interface StarsProps {
    num: number
}
export const Stars: React.FC<StarsProps> = (props: StarsProps) => {
    return (
        <svg className={styles.stars}>
            {[...Array(props.num)].map((e, i) => {
                const cx = Math.round(Math.random() * 10000) / 100 + '%'
                const cy = Math.round(Math.random() * 10000) / 100 + '%'
                const r = Math.round(Math.random() * 10) / 10
                return (
                    <circle
                        key={i}
                        className={styles.star}
                        cx={cx}
                        cy={cy}
                        r={r}
                    />
                )
            })}
        </svg>
    )
}

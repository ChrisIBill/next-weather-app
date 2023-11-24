//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { useTheme } from '@/lib/context'
import styles from './dayNightColorLayer.module.scss'
import { percentToGradientStringMapper } from '@/lib/time'

export const TimesOfDAy = ['morning', 'day', 'evening', 'night'] as const
export type TimeOfDay = (typeof TimesOfDAy)[number]

export interface ColorLayerProps {
    isDay: boolean
    timePercent: number
}

const lightBackgroundColors = {
    morning: '#0545B3',
    day: '#0098DB',
    evening: '#4211D6',
    night: '#2C0C95',
}
const darkBackgroundColors = {
    morning: '#04358B',
    day: '#005FA3',
    evening: '#3B0FBD',
    night: '#210971',
}
//const darkBackgroundColors = {

export const DayNightColorLayer: React.FC<ColorLayerProps> = ({
    isDay,
    timePercent,
}: ColorLayerProps) => {
    //minutes in day = 1440
    const theme = useTheme().theme
    const backgroundColors =
        theme === 'dark' ? darkBackgroundColors : lightBackgroundColors

    const angle = timePercent > 0.5 ? timePercent * 10 : timePercent * 10 + 350
    const bgColor = () => {
        if (isDay && 0.2 < timePercent && timePercent < 0.8)
            return backgroundColors.day
        else if ((isDay && timePercent < 0.2) || (!isDay && timePercent > 0.8))
            return backgroundColors.morning
        else if ((isDay && timePercent > 0.8) || (!isDay && timePercent < 0.2))
            return backgroundColors.evening
        else return backgroundColors.night
    }
    const bgGradient = isDay ? 'rgb(255,255,255)' : 'rgb(0,0,0)'

    //const gradientHour = percentToGradientStringMapper(isDay, timePercent)
    //const dayNightColorStyle = `dayNightColorGradient${gradientHour}`
    return (
        <div
            className={styles.dayNightColorLayer}
            style={{
                background: `linear-gradient(${angle}deg, ${bgColor()} 0%, ${bgGradient} 200%)`,
            }}
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
    return [...Array(3)].map((e, i) => (
        <svg key={i} className={styles.stars}>
            {[...Array(props.num)].map((e, i) => {
                const cx = Math.round(Math.random() * 10000) / 100
                const cy = Math.round(Math.random() * 10000) / 100
                const r = Math.round(Math.random() * 15) / 10
                return (
                    <circle
                        key={i}
                        className={styles.star}
                        cx={cx + '%'}
                        cy={cy + '%'}
                        r={r}
                    />
                )
            })}
        </svg>
    ))
}

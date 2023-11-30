//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { useTheme } from '@mui/material/styles'
import styles from './dayNightColorLayer.module.scss'
import {
    getTimeOfDay,
    percentToGradientStringMapper,
    TimeObjectType,
    TimeOfDay,
} from '@/lib/time'

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

export const useBackgroundColors = () => {
    const palette = useTheme().palette
    return palette.mode === 'dark'
        ? palette.augmentColor
        : lightBackgroundColors
}
//const darkBackgroundColors = {

export interface ColorLayerProps {
    timeObj: TimeObjectType
}

export const DayNightColorLayer: React.FC<ColorLayerProps> = ({
    timeObj,
}: ColorLayerProps) => {
    //minutes in day = 1440
    const theme = useTheme()
    const palette = theme.palette
    const backgroundColors = useBackgroundColors()

    const timePercent = timeObj.timePercent!
    const isDay = timeObj.isDay!
    const angle = timePercent > 0.5 ? timePercent * 10 : timePercent * 10 + 350

    const bgColor = backgroundColors[timeObj.timeOfDay!]
    if (!bgColor) console.log('bgColor undefined', timeObj)
    const bgGradient = isDay ? 'rgb(255,255,255)' : 'rgb(0,0,0)'

    //const gradientHour = percentToGradientStringMapper(isDay, timePercent)
    //const dayNightColorStyle = `dayNightColorGradient${gradientHour}`
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
    return (
        <div
            className={styles.dayNightColorLayer}
            style={{
                background: `linear-gradient(${angle}deg, ${bgColor} 0%, ${bgGradient} 200%)`,
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

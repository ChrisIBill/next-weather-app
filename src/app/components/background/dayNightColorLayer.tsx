//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { useTheme } from '@mui/material/styles'
import styles from './dayNightColorLayer.module.scss'
import { TimeObjectType } from '@/lib/time'
import { TimeClassType } from '@/lib/obj/time'

export const useBackgroundColors = () => {
    const palette = useTheme().palette
    return palette.mode === 'dark'
        ? {
              morning: {
                  sky: palette.morningSky.dark,
                  horizon: palette.morningHorizon.dark,
              },
              day: {
                  sky: palette.daySky.dark,
                  horizon: palette.dayHorizon.dark,
              },
              evening: {
                  sky: palette.eveningSky.dark,
                  horizon: palette.eveningHorizon.dark,
              },
              night: {
                  sky: palette.nightSky.dark,
                  horizon: palette.nightHorizon.dark,
              },
          }
        : {
              morning: {
                  sky: palette.morningSky.light,
                  horizon: palette.morningHorizon.light,
              },
              day: {
                  sky: palette.daySky.light,
                  horizon: palette.dayHorizon.light,
              },
              evening: {
                  sky: palette.eveningSky.light,
                  horizon: palette.eveningHorizon.light,
              },
              night: {
                  sky: palette.nightSky.light,
                  horizon: palette.nightHorizon.light,
              },
          }
}

export interface ColorLayerProps {
    timeObj?: TimeClassType
}

export const DayNightColorLayer: React.FC<ColorLayerProps> = ({
    timeObj,
}: ColorLayerProps) => {
    const palette = useTheme().palette
    const backgroundColors = useBackgroundColors()

    const timePercent = timeObj?.getTimePercent?.() ?? 0.66
    const timeOfDay =
        timeObj?.getTimeOfDay?.() ?? palette.mode === 'dark' ? 'night' : 'day'
    const angle = timePercent > 0.5 ? timePercent * 10 : timePercent * 10 + 350

    const bgColor = backgroundColors[timeOfDay]
    const gradientString = `linear-gradient(${angle}deg, ${bgColor.horizon} 0%, ${bgColor.sky} 100%)`
    if (!bgColor) console.log('bgColor undefined', timeObj)

    return (
        <div
            className={styles.dayNightColorLayer}
            style={{
                background: gradientString,
            }}
        >
            {/*isDay ? <></> : <StarryNightBackground />*/}
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

//NOTE: Current implementation will struggle with unusual sunrise/sunset times
//      as might appear in the far north or south.  For example, in Tromso, Norway,
import { useTheme } from '@mui/material/styles'
import styles from './dayNightColorLayer.module.scss'
import { DayTimeClassType, TimeClassType, TimeOfDayType } from '@/lib/obj/time'
import { useForecastObjStore, useUserPrefsStore } from '@/lib/stores'
import { DailyWeatherForecastObjectType } from '@/lib/interfaces'
import { rgbToHsl } from '@/lib/lib'

interface BackgroundColorsType {
    morning: {
        sky: string
        horizon: string
    }
    day: {
        sky: string
        horizon: string
    }
    evening: {
        sky: string
        horizon: string
    }
    night: {
        sky: string
        horizon: string
    }
    [key: string]: {
        sky: string
        horizon: string
    }
}

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
    isCard?: boolean
    forecastObj?: DailyWeatherForecastObjectType
}

export const ColorLayerWrapper: React.FC<ColorLayerProps> = (props) => {
    return props.isCard ? (
        <ColorLayerStaticWrapper />
    ) : (
        <ColorLayerStateWrapper />
    )
}
export const ColorLayerStateWrapper: React.FC<ColorLayerProps> = (props) => {
    const timeOfDay = useForecastObjStore((state) => state.timeOfDay.state)
    const isDay = useForecastObjStore((state) => state.isDay.state)
    const timePercent = useForecastObjStore((state) => state.timePercent.state)
    const temperature = useForecastObjStore(
        (state) => state.temperatureMagnitude.state
    )
    console.log(
        'Color Layer State: ',
        timeOfDay,
        isDay,
        timePercent,
        temperature
    )
    return (
        <DayNightColorLayer
            {...props}
            timeOfDay={timeOfDay}
            isDay={isDay}
            timePercent={timePercent}
            temperatureMagnitude={temperature}
        />
    )
}
export const ColorLayerStaticWrapper: React.FC<ColorLayerProps> = (
    props: ColorLayerProps
) => {
    const palette = useTheme().palette
    const [timeOfDay, isDay] =
        palette.mode === 'dark' ? ['night', false] : ['day', true]
    const timePercent = 0.5
    const temperature = 21
    return (
        <DayNightColorLayer
            {...props}
            timeOfDay={timeOfDay as TimeOfDayType}
            isDay={isDay}
            timePercent={timePercent}
            temperatureMagnitude={temperature}
        />
    )
}

export interface DayNightColorLayerProps extends ColorLayerProps {
    timeOfDay?: TimeOfDayType
    isDay?: boolean
    timePercent?: number
    temperatureMagnitude?: number
}

export const DayNightColorLayer: React.FC<DayNightColorLayerProps> = (
    props: DayNightColorLayerProps
) => {
    const palette = useTheme().palette
    const backgroundColors = useBackgroundColors()
    const timeOfDay = props.timeOfDay ?? 'day'
    const isDay = props.isDay ?? true
    const timePercent = props.timePercent ?? 0.5
    const temperature = props.temperatureMagnitude ?? 0

    const angle = timePercent > 0.5 ? timePercent * 10 : timePercent * 10 + 350

    const bgColors = backgroundColors[timeOfDay]
    console.log('bgColors: ', bgColors)
    Object.keys(bgColors).forEach((colorKey) => {
        const color = bgColors[colorKey]
        console.log('color: ', color)
        const [r, g, b] = color
            .substring(4, color.length - 1)
            .replace(/ /g, '')
            .split(',')
            .map((c: string) => parseInt(c))
        const [h, s, l] = rgbToHsl(r, g, b)
        console.log('hsl: ', h, s, l)
        let oldColor = `hsl(${h}, ${s}%, ${l}%)`
        let newColor = `hsl(${h + temperature}, ${s + temperature * 0.5}%, ${
            l + temperature
        }%)`
        //let newColor = `rgb(${r + temperature * 2}, ${g}, ${
        //    b - temperature * 2
        //})`
        console.log('temperature: ', temperature)
        //if (temperature > 0) newColor = `rgb(${r + temperature}, ${g}, ${b})`
        //else newColor = `rgb(${r}, ${g}, ${b - temperature})`
        console.log('newColor: ', newColor)
        bgColors[colorKey] = newColor
    })
    //Object.keys(bgColors).forEach((colorKey) => {
    //    const color = bgColors[colorKey]
    //    const [r, g, b] = color
    //        .substring(4, color.length - 1)
    //        .replace(/ /g, '')
    //        .split(',')
    //        .map((c: string) => parseInt(c))
    //    const [h, s, l] = rgbToHsl(r, g, b)
    //    bgColors[colorKey] = `hsl(${h}, ${s}%, ${l}%)`
    //})
    console.log('bgColorsEffectsMapped: ', bgColors)
    //const gradientString = `linear-gradient(${angle}deg, ${bgColors.horizon} 0%, ${bgColors.sky} 100%)`
    const gradientString = `linear-gradient(${angle}deg, ${bgColors.horizon} 0%, ${bgColors.sky} 100%)`

    if (!bgColors)
        throw new Error('bgColor is undefined for timeOfDay: ' + timeOfDay)

    return (
        <div
            className={styles.dayNightColorLayer}
            style={{
                background: gradientString,
            }}
        >
            {isDay ? <></> : <StarryNightBackground isCard={props.isCard} />}
        </div>
    )
}

export interface StarryNightBackgroundProps {
    isCard?: boolean
}

export const StarryNightBackground: React.FC<StarryNightBackgroundProps> = (
    props: StarryNightBackgroundProps
) => {
    return (
        <div className={styles.starsWrapper}>
            <Stars num={props.isCard ? 100 : 300} />
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
                const r = Math.round((1 + Math.random()) * 7.5) / 10
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

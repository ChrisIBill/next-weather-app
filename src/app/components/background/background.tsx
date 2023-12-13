import Image from 'next/image'
import React, { useEffect, useCallback } from 'react'
import styles from './background.module.scss'
import { DayNightColorLayer } from './dayNightColorLayer'
import { CelestialIconsHandler } from './celestialIcons'
import {
    TimeObjectType,
    clockTimeToMinutes,
    dayLengthCalculator,
} from '@/lib/time'
import { RainBackground } from '@/app/rain'
import { DetailedWeatherDataType, ForecastObjectType } from '@/lib/interfaces'
import { calcPercentOfDayNight } from '@/lib/time'
import { useTheme } from '@mui/material/styles'
import { useWindowDimensions } from '@/lib/hooks'
import { CloudsGenerator } from './clouds'
import PrecipitationClass, {
    DEFAULT_PRECIPITATION_CLASS,
} from '@/lib/obj/precipitation'
import { TimeClassType } from '@/lib/obj/time'

export interface BackgroundProps {
    weatherForecast?: DetailedWeatherDataType
    forecastObj?: ForecastObjectType
    isCard?: boolean
}

export interface BackgroundComponentsProps {
    xScale: number
    yScale: number
    width: number
    height: number
}
export const Background: React.FC<BackgroundProps> = (
    props: BackgroundProps
) => {
    const ref = React.useRef<HTMLDivElement>(null)

    const precipObj =
        props.forecastObj?.precipitationObj || DEFAULT_PRECIPITATION_CLASS

    //TODO: Should probably handle client scaling higher up the tree
    const containerWidth = ref?.current?.clientWidth || window.innerWidth
    const containerHeight = ref?.current?.clientHeight || window.innerHeight
    const windowHeight = props.isCard ? containerHeight : window.innerHeight
    const windowWidth = props.isCard ? containerWidth : window.innerWidth

    const width = containerWidth
    const height = containerHeight
    const yScale = windowHeight / 100
    const xScale = windowWidth / 100

    const avgTemp = props.forecastObj?.temperatureObj.getAvgTemp() ?? 20
    const frozenImageOpacity = avgTemp < 0 ? 0.5 : 0

    const forecast = props.weatherForecast

    return (
        <div
            className={styles.wrapper}
            ref={ref}
            style={{
                top: props.isCard ? '0' : '-4rem',
                overflow: 'hidden',
            }}
        >
            <Image
                src="/frozen-corner-1.png"
                objectFit="scale-down"
                //fill={true}
                width={841} //841px
                height={687} //687px
                alt="frozen-border"
                style={{
                    position: 'absolute',
                    top: props.isCard ? '0' : '3rem',
                    zIndex: 50,
                    opacity: frozenImageOpacity,
                    //WebkitMaskImage:
                    //    'radial-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.1), rgba(0,0,0,1))',
                }}
            />
            <RainBackground
                isCard={props.isCard ? true : false}
                precipObj={precipObj as PrecipitationClass}
                xScale={xScale}
                yScale={yScale}
                width={width}
                height={height}
                precipitation_probability={
                    forecast?.precipitation_probability as number
                }
                precipitation={forecast?.precipitation as number}
                precipitation_type={forecast?.precipitation_type as string}
            />
            <CloudsGenerator
                xScale={xScale}
                yScale={props.isCard ? yScale : window.innerHeight / 100}
                width={width}
                height={props.isCard ? height : window.innerHeight}
            />
            <ClockworkBackgroundComponents isCard={props.isCard} />
        </div>
    )
}

interface ClockworkProps {
    isCard?: boolean
}
const ClockworkBackgroundComponents: React.FC<ClockworkProps> = (
    props: ClockworkProps
) => {
    const ref = React.useRef<HTMLDivElement>(null)
    //TODO: Should probably generate and pass minimum viable objs from background root
    //const timeObj = props.timeObj
    //    ? props.timeObj
    //    : {
    //          isDay: palette.mode === 'dark' ? false : true,
    //          timePercent: 0.5,
    //          timeOfDay: palette.mode === 'dark' ? 'night' : 'day',
    //      }

    return (
        <div className={styles.clockworkWrapper} ref={ref}>
            <CelestialIconsHandler parentRef={ref} isCard={props.isCard} />
            <DayNightColorLayer />
        </div>
    )
}

'use client'
import Image from 'next/image'
import React, { useEffect, useCallback } from 'react'
import styles from './background.module.scss'
import { DayNightColorLayer } from './dayNightColorLayer'
import {
    CelestialIconsHandler,
    CelestialIconsHandlerProps,
    CelestialIconsProps,
} from './celestialIcons'
import {
    TimeObjectType,
    clockTimeToMinutes,
    dayLengthCalculator,
} from '@/lib/time'
import { RainBackground, RainBackgroundStateWrapper } from '@/app/rain'
import { DetailedWeatherDataType, ForecastObjectType } from '@/lib/interfaces'
import { calcPercentOfDayNight } from '@/lib/time'
import { useTheme } from '@mui/material/styles'
import { useWindowDimensions } from '@/lib/hooks'
import { CloudsGenerator } from './clouds'
import PrecipitationClass, {
    DEFAULT_PRECIPITATION_CLASS,
} from '@/lib/obj/precipitation'
import { DayTimeClassType, TimeClassType } from '@/lib/obj/time'
import frozenImageOverlay from '/public/frozen-corner-1.png'
import dynamic from 'next/dynamic'

export interface BackgroundProps {
    forecastObj?: ForecastObjectType
    isCard?: boolean
    //timeObj: DayTimeClassType[]
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
    const [containerDimensions, setContainerDimensions] = React.useState({
        width: 0,
        height: 0,
    })

    const ref = React.useRef<HTMLDivElement>(null)

    const precipObj =
        props.forecastObj?.precipitationObj || DEFAULT_PRECIPITATION_CLASS

    //TODO: Should probably handle client scaling higher up the tree
    const windowDimensions = useWindowDimensions()

    const width = containerDimensions.width
    const height = containerDimensions.height
    const yScale = height / 100
    const xScale = width / 100

    const avgTemp = props.forecastObj?.temperatureObj.getAvgTemp() ?? 20
    const frozenImageOpacity = avgTemp < 0 ? 0.5 : 0

    useEffect(() => {
        //if card then need container dimensions, otherwise use window dimensions
        const handleContainerDimensions = () => {
            console.log('handleContainerDimensions')
            if (props.isCard && ref.current)
                return {
                    width: ref.current.clientWidth,
                    height: ref.current.clientHeight,
                }
            else if (typeof window !== 'undefined')
                return {
                    width: window.innerWidth,
                    height: window.innerHeight,
                }
            else
                return {
                    width: 0,
                    height: 0,
                }
        }
        const { width, height } = handleContainerDimensions()
        console.log('width, height', width, height)
        setContainerDimensions(handleContainerDimensions())
    }, [props.isCard, windowDimensions])

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
                src={frozenImageOverlay}
                //objectFit="scale-down"
                //fill={true}
                //width={841} //841px
                //height={687} //687px
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
            <RainBackgroundStateWrapper
                isCard={props.isCard ? true : false}
                precipObj={precipObj as PrecipitationClass}
                xScale={xScale}
                yScale={yScale}
                width={width}
                height={height}
            />
            <CloudsGenerator
                xScale={xScale}
                //yScale={props.isCard ? yScale : window.innerHeight / 100}
                yScale={yScale}
                width={width}
                //height={props.isCard ? height : window.innerHeight}
                height={height}
            />
            <ClockworkBackgroundComponents
                isCard={props.isCard}
                wrapperHeight={height}
                wrapperWidth={width}
            />
        </div>
    )
}

interface ClockworkProps {
    isCard?: boolean
    //timeObj: DayTimeClassType[]
    wrapperWidth: number
    wrapperHeight: number
}

const CelestialIconsHandler2 = dynamic<CelestialIconsHandlerProps>(
    () => import('./celestialIcons').then((mod) => mod.CelestialIconsHandler),
    { ssr: false }
)

const ClockworkBackgroundComponents: React.FC<ClockworkProps> = (
    props: ClockworkProps
) => {
    const [isClient, setIsClient] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        <div className={styles.clockworkWrapper} ref={ref}>
            <CelestialIconsHandler2
                //timeObj={props.timeObj}
                parentRef={ref}
                isCard={props.isCard}
                wrapperWidth={props.wrapperWidth}
                wrapperHeight={props.wrapperHeight}
            />
            <DayNightColorLayer timeObj={props.timeObj} />
        </div>
    )
}

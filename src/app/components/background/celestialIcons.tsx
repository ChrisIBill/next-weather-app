'use client'
import React, { useRef, memo, useEffect } from 'react'
import styles from './celestialIcons.module.scss'
import { CelestialIcon, MoonIcon, SunIcon } from '../icons'
import { bezierCurve } from '@/lib/lib'
import { DayTimeClassType, TimeClassType } from '@/lib/obj/time'
import { useTheme } from '@mui/material'
import { AnimationLevelsEnum, useUserPrefsStore } from '@/lib/stores'
import { useForecastObjStore } from '@/lib/obj/forecastStore'
import { PosCoordinates } from '@/lib/interfaces'
import ErrorBoundary from '@/lib/errorBoundary'

export interface CelestialIconsHandlerProps {
    wrapperWidth: number
    wrapperHeight: number
    //timeObj: DayTimeClassType[]
    parentRef?: React.RefObject<HTMLDivElement>
    isCard?: boolean
    eclipse?: boolean
    phase?: number
    event?: string
}

export const CelestialIconsHandler: React.FC<CelestialIconsHandlerProps> = (
    props: CelestialIconsHandlerProps
) => {
    const animationLevel = useUserPrefsStore((state) => state.animationLevel)
    //TODO: Need a static and dynamic version of this, static for cards, dynamic for main, for better handling of state
    const ref = React.useRef<HTMLDivElement>(null)

    const width = props.wrapperWidth ?? 300
    const height = props.wrapperHeight ?? 300
    const yScale = height / 300
    const xScale = width / 300
    const iconSize = xScale > 3 ? 30 * xScale : 80
    return (
        <div
            className="CelestialsContainer"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                width: props.isCard ? '100%' : '100vw',
                height: props.isCard ? '100%' : '100vh',
            }}
        >
            {props.isCard || animationLevel <= AnimationLevelsEnum.Low ? (
                <StaticCelestialIcons
                    iconSize={iconSize}
                    isCard={props.isCard}
                />
            ) : (
                <ErrorBoundary
                    fallback={
                        <StaticCelestialIcons
                            iconSize={iconSize}
                            isCard={props.isCard}
                        />
                    }
                >
                    <CelestialIconsPathGenerator
                        //timeObj={props.timeObj}
                        isCard={props.isCard}
                        iconSize={iconSize}
                        xScale={xScale}
                        yScale={yScale}
                        wrapperWidth={width}
                        wrapperHeight={height}
                    />
                </ErrorBoundary>
            )}
        </div>
    )
}

export interface CelestialIconsProps {
    iconSize: number
    isCard?: boolean
}

export interface StaticCelestialIconsProps extends CelestialIconsProps {}

//const StaticCelestialIcons: React.FC<StaticCelestialIconsProps> = (
const StaticCelestialIcons = memo(function StaticCelestialIcons(
    props: StaticCelestialIconsProps
) {
    //TODO: Should be possible to use same exact component across all cards, no additional rendering needed
    const palette = useTheme().palette
    const isDay = palette.mode === 'light' ? true : false
    return (
        <div
            className={styles.iconWrapper}
            style={{
                backgroundColor: 'transparent',
                width: props.iconSize,
                height: props.iconSize,
            }}
        >
            <CelestialIcon isDay={isDay} size={props.iconSize} />
        </div>
    )
})

interface CelestialIconsPathGeneratorProps extends CelestialIconsProps {
    isCard?: boolean
    timeObj?: DayTimeClassType[]
    wrapperWidth: number
    wrapperHeight: number
    xScale: number
    yScale: number
}

const CelestialIconsPathGenerator = memo(function CelestialIconPathGenerator(
    props: CelestialIconsPathGeneratorProps
) {
    const [p0, p1, p2, p3] = [
        { x: 0 * props.xScale, y: 110 * props.yScale },
        { x: 100 * props.xScale, y: 50 * props.yScale },
        { x: 200 * props.xScale, y: 50 * props.yScale },
        { x: 300 * props.xScale, y: 110 * props.yScale },
    ]
    const bezierPath = new Array(100)
        .fill(undefined)
        .map((_, i) => bezierCurve(i / 100, p0, p1, p2, p3))
    const bezierString = bezierPath.reduce((acc, { x, y }) => {
        return `${acc} L${x} ${y}`
    }, `M${p0.x} ${p0.y}`)
    return (
        <svg
            className={styles.CelestialsSVG}
            style={{
                position: 'absolute',
            }}
            width={props.wrapperWidth}
            height={props.wrapperHeight}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* DON'T DELETE THIS COMMENTED OUT PATH, IT'S FOR DEBUGGING */}
            {/* <path d={bezierString} stroke="#111" /> */}
            <DynamicCelestialIcons
                bezierPath={bezierPath}
                bezierString={bezierString}
                iconSize={props.iconSize}
                wrapperWidth={props.wrapperWidth}
                wrapperHeight={props.wrapperHeight}
            />
        </svg>
    )
})

interface DynamicCelestialIconsProps extends CelestialIconsProps {
    isCard?: boolean
    bezierPath: PosCoordinates[]
    bezierString: string
    wrapperWidth: number
    wrapperHeight: number
}

const DynamicCelestialIcons: React.FC<DynamicCelestialIconsProps> = (
    props: DynamicCelestialIconsProps
) => {
    const [firstTime, setFirstTime] = React.useState(true)
    const timePercent = useForecastObjStore((state) => state.timePercent.state)
    const isDay = useForecastObjStore((state) => state.isDay.state)
    const bezierIndex = Math.round(timePercent * 100)
    const bezierPos = props.bezierPath[bezierIndex]

    useEffect(() => {
        if (firstTime) setFirstTime(false)
    }, [firstTime])

    return (
        <g>
            {firstTime ? (
                <animateMotion
                    dur="10s"
                    fill="freeze"
                    repeatCount="1"
                    path={props.bezierString}
                    keyPoints={`${0}; ${timePercent}`}
                    keyTimes="0; 1"
                    keySplines="0 0 0.58 1; "
                />
            ) : (
                <></>
            )}
            <foreignObject
                className={styles.svgIconObject}
                x={firstTime ? undefined : bezierPos.x}
                y={firstTime ? undefined : bezierPos.y}
                width={props.iconSize}
                height={props.iconSize}
                style={{
                    position: 'absolute',
                }}
            >
                <div
                    className={styles.iconWrapper}
                    style={{
                        overflow: 'visible',
                        width: props.iconSize,
                        height: props.iconSize,
                        top: -props.iconSize * 0.5,
                        left: -props.iconSize * 0.5,
                    }}
                >
                    <CelestialIcon isDay={isDay} size={props.iconSize} />
                </div>
            </foreignObject>
        </g>
    )
}

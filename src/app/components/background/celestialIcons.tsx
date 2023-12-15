'use client'
import React, { useRef, memo, useEffect } from 'react'
import styles from './celestialIcons.module.scss'
import { CelestialIcon, MoonIcon, SunIcon } from '../icons'
import { bezierCurve } from '@/lib/lib'
import { DayTimeClassType, TimeClassType } from '@/lib/obj/time'
import { useTheme } from '@mui/material'
import {
    AnimationLevelsEnum,
    useForecastObjStore,
    useUserPrefsStore,
} from '@/lib/stores'
import { PosCoordinates } from '@/lib/interfaces'

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
    console.log('CelestialIconsHandler props', props)
    //TODO: Need a static and dynamic version of this, static for cards, dynamic for main, for better handling of state
    const ref = React.useRef<HTMLDivElement>(null)

    const palette = useTheme().palette
    //TODO: Should probably handle client scaling higher up the tree
    const width = props.wrapperWidth ?? 300
    const height = props.wrapperHeight ?? 300
    const yScale = height / 300
    const xScale = width / 300
    const iconSize = xScale > 3 ? 30 * xScale : 80
    console.log('Scaling calcs: ', { xScale, yScale, iconSize })
    const [p0, p1, p2, p3] = [
        { x: 0 * xScale, y: 90 * yScale },
        { x: 100 * xScale, y: 0 * yScale },
        { x: 200 * xScale, y: 0 * yScale },
        { x: 300 * xScale, y: 90 * yScale },
    ]
    let bezierPath = ''
    for (let i = 0; i < 1.01; i += 0.01) {
        const { x, y } = bezierCurve(i, p0, p1, p2, p3)
        bezierPath += `L${x} ${y}`
    }

    return animationLevel <= AnimationLevelsEnum.Low ? (
        <StaticCelestialIcons iconSize={iconSize} />
    ) : (
        <CelestialIconsPathGenerator
            //timeObj={props.timeObj}
            iconSize={iconSize}
            xScale={xScale}
            yScale={yScale}
            wrapperWidth={width}
            wrapperHeight={height}
        />
    )
}

export interface CelestialIconsProps {
    iconSize: number
}

export interface StaticCelestialIconsProps extends CelestialIconsProps {}

export const StaticCelestialIcons: React.FC<CelestialIconsProps> = (
    props: CelestialIconsProps
) => {
    const palette = useTheme().palette
    const isDay = palette.mode === 'light' ? true : false
    return (
        <div
            className={styles.iconWrapper}
            style={{
                width: props.iconSize,
                height: props.iconSize,
                top: -props.iconSize * 0.5,
                left: -props.iconSize * 0.5,
            }}
        >
            <CelestialIcon isDay={isDay} size={props.iconSize} />
        </div>
    )
}

interface CelestialIconsPathGeneratorProps extends CelestialIconsProps {
    isCard?: boolean
    timeObj?: DayTimeClassType[]
    wrapperWidth: number
    wrapperHeight: number
    xScale: number
    yScale: number
}

export const CelestialIconsPathGenerator = memo(
    function CelestialIconPathGenerator(
        props: CelestialIconsPathGeneratorProps
    ) {
        //const [bezierPath, setBezierPath] = React.useState([])
        console.log('RERENDERING CelestialIconPathGenerator')
        const [p0, p1, p2, p3] = [
            { x: 0 * props.xScale, y: 110 * props.yScale },
            { x: 100 * props.xScale, y: 50 * props.yScale },
            { x: 200 * props.xScale, y: 50 * props.yScale },
            { x: 300 * props.xScale, y: 110 * props.yScale },
        ]
        //let bezierPath = ''
        const bezierPath = new Array(100)
            .fill(undefined)
            .map((_, i) => bezierCurve(i / 100, p0, p1, p2, p3))
        const bezierString = bezierPath.reduce((acc, { x, y }) => {
            return `${acc} L${x} ${y}`
        }, `M${p0.x} ${p0.y}`)
        //for (let i = 0; i < 100; i++) {
        //    const { x, y } = bezierCurve(i/100, p0, p1, p2, p3)
        //    set
        //}
        return (
            <svg
                className={styles.CelestialsSVG}
                style={{
                    position: 'absolute',
                    marginTop: '4rem',
                }}
                width={props.wrapperWidth}
                height={props.wrapperHeight}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* <path d={bezierString} stroke="#111" /> */}
                {props.isCard ? (
                    <CardCelestialIcons
                        bezierPath={bezierPath}
                        bezierString={bezierString}
                        iconSize={props.iconSize}
                        timeObj={props.timeObj}
                        // xScale={props.xScale}
                        // yScale={props.yScale}
                    />
                ) : (
                    <PageCelestialIcons
                        timeObj={props.timeObj}
                        bezierPath={bezierPath}
                        bezierString={bezierString}
                        iconSize={props.iconSize}
                        wrapperWidth={props.wrapperWidth}
                        wrapperHeight={props.wrapperHeight}
                        //xScale={props.xScale}
                        //yScale={props.yScale}
                    />
                )}
            </svg>
        )
    }
)

export interface DynamicCelestialIconsProps extends CelestialIconsProps {
    isCard?: boolean
    timeObj?: DayTimeClassType[]
    bezierPath: PosCoordinates[]
    bezierString: string
    wrapperWidth: number
    wrapperHeight: number
}

export interface PageCelestialIconsProps extends DynamicCelestialIconsProps {}

export const PageCelestialIcons: React.FC<PageCelestialIconsProps> = (
    props: DynamicCelestialIconsProps
) => {
    const prevTimePercent = useRef(0)
    const [firstTime, setFirstTime] = React.useState(true)
    const palette = useTheme().palette
    const time = useForecastObjStore((state) => state.time.state)
    const timePercent = useForecastObjStore((state) => state.timePercent.state)
    const isDay = useForecastObjStore((state) => state.isDay.state)
    const bezierIndex = Math.round(timePercent * 100)
    const bezierPos = props.bezierPath[bezierIndex]

    useEffect(() => {
        if (firstTime) setFirstTime(false)
    }, [])

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

export const CardCelestialIcons: React.FC<DynamicCelestialIconsProps> = (
    props: DynamicCelestialIconsProps
) => {}

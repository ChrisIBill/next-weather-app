'use client'
import './celestialIcons.css'
import { Slider, SliderRail, SliderTrack, styled } from '@mui/material'
import CircularSlider from '@fseehawer/react-circular-slider'
import {
    CircularInput,
    CircularTrack,
    CircularProgress,
    CircularThumb,
    useCircularInputContext,
} from 'react-circular-input'
import React from 'react'
import styles from './celestialIcons.module.scss'
import { MoonIcon, SunIcon } from '../icons'
import { constants } from 'perf_hooks'
import { PosCoordinates } from '@/lib/interfaces'
//import dynamic from 'next/dynamic'
//const DynamicMoon = dynamic(() =>
//    import('../icons').then((mod) => mod.MoonIcon)
//)
//const DynamicSun = dynamic(() => import('../icons').then((mod) => mod.SunIcon))

export interface CelestialIconsProps {
    isDay: boolean
    timePercent: number
    eclipse?: boolean
    phase?: number
    event?: string
}

const CustomComponent = () => {
    const { getPointFromValue, value } = useCircularInputContext()
    const coords = getPointFromValue()
    const [x, y] = coords ? [coords.x, coords.y] : [0, 0]

    return (
        <text x={x} y={y} style={{ pointerEvents: 'none' }}>
            <MoonIcon />
        </text>
    )
}

export const DepCelestialIconsHandler: React.FC<CelestialIconsProps> = ({
    isDay,
    timePercent,
}: CelestialIconsProps) => {
    const [value, setValue] = React.useState<number>(0)
    const celestialRail = styled(SliderRail)(({ theme }) => ({
        backgroundColor: 'white',
    }))
    return (
        <div className={styles.wrapper}>
            <CircularInput value={value} onChange={setValue}>
                <CircularSlider trackColor="#fff" trackSize={10} width={700} />
                <CircularThumb />
                <CustomComponent />
                {/* isDay ? (
                    <SunIcon inputContext={useCircularInputContext} />
                ) : (
                    <MoonIcon inputContext={useCircularInputContext} />
                )*/}
            </CircularInput>
        </div>
    )
}
export function bezierCurve(
    t: number,
    p0: PosCoordinates,
    p1: PosCoordinates,
    p2: PosCoordinates,
    p3: PosCoordinates
): PosCoordinates {
    const cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX

    const cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY

    const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x
    const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y

    return { x: x, y: y }
}
export const CelestialIconsHandler: React.FC<CelestialIconsProps> = ({
    isDay,
    timePercent,
}: CelestialIconsProps) => {
    const { innerWidth: width, innerHeight: height } = window
    console.log('width', width)
    console.log('height', height)
    const widthStretchFator = width / 400
    const heightStretchFator = height / 400
    const [p0, p1, p2, p3] = [
        { x: 30 * widthStretchFator, y: 400 * heightStretchFator },
        { x: 150 * widthStretchFator, y: 300 * heightStretchFator },
        { x: 270 * widthStretchFator, y: 300 * heightStretchFator },
        { x: 390 * widthStretchFator, y: 400 * heightStretchFator },
    ]
    const celestialRail = styled(SliderRail)(({ theme }) => ({
        backgroundColor: 'white',
    }))
    const bezierPos = bezierCurve(timePercent, p0, p1, p2, p3)
    const timePercents = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    const beziers: PosCoordinates[] = timePercents.map((timePercent) =>
        bezierCurve(timePercent, p0, p1, p2, p3)
    )

    console.log('beziers: ', beziers)
    console.log('timepercent', timePercent)
    const [iconCoords, setIconCoords] = React.useState({ x: 10, y: 80 })

    return (
        <svg
            className={styles.CelestialsSVG}
            width={width}
            height={height}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                className="knob"
                r="25"
                cx={bezierPos.x}
                cy={bezierPos.y}
                fill="#88CE02"
                stroke-width="4"
                stroke="#111"
            />
        </svg>
    )
}

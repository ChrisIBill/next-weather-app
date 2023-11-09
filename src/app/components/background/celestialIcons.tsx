'use client'
import React from 'react'
import styles from './celestialIcons.module.scss'
import { CelestialIcon, MoonIcon, SunIcon } from '../icons'
import { GCProps, PosCoordinates } from '@/lib/interfaces'
import { bezierCurve } from '@/lib/lib'

export interface CelestialIconsProps extends GCProps {
    isDay: boolean
    timePercent: number
    eclipse?: boolean
    phase?: number
    event?: string
}

export const CelestialIconsHandler: React.FC<CelestialIconsProps> = ({
    isDay,
    timePercent,
    variant,
}: CelestialIconsProps) => {
    //TODO: Should probably handle client scaling higher up the tree
    const { innerWidth: width, innerHeight: height } = window
    const xScale = width / 300
    const yScale = height / 300
    const avgScale = (xScale + yScale) / 2
    const [iconScaledX, iconScaledY] = [25 * avgScale, 25 * avgScale]
    console.log('Client Window properties: ', {
        width,
        height,
        xScale,
        yScale,
        avgScale,
    })
    const [p0, p1, p2, p3] = [
        { x: 0 * xScale, y: 110 * yScale },
        { x: 100 * xScale, y: 0 * yScale },
        { x: 200 * xScale, y: 0 * yScale },
        { x: 300 * xScale, y: 110 * yScale },
    ]
    const bezierPos = bezierCurve(timePercent, p0, p1, p2, p3)
    let bezierPath = ''
    for (let i = 0; i < 1.01; i += 0.01) {
        const { x, y } = bezierCurve(i, p0, p1, p2, p3)
        bezierPath += `L${x} ${y}`
    }
    console.log('timepercent', timePercent)
    console.log('x, y, avg scale factors: ', xScale, yScale, avgScale)
    return (
        <svg
            className={styles.CelestialsSVG}
            width={width}
            height={height}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/*
                ALLOWS FOR TESTING OF BEZIER CURVE 
                <path d={`M${p0.x} ${p0.y} ${bezierPath}`} stroke="#111" />
            */}
            <foreignObject
                className={styles.svgIconObject}
                height={iconScaledY}
                width={iconScaledX}
                x={bezierPos.x}
                y={bezierPos.y}
            >
                <CelestialIcon isDay={isDay} variant={variant} />
            </foreignObject>
        </svg>
    )
}

'use client'
import React, { useEffect } from 'react'
import styles from './celestialIcons.module.scss'
import { CelestialIcon, MoonIcon, SunIcon } from '../icons'
import { bezierCurve } from '@/lib/lib'
import { TimeClassType } from '@/lib/obj/time'
import { useTheme } from '@mui/material'

export interface CelestialIconsProps {
    timeObj?: TimeClassType
    parentRef?: React.RefObject<HTMLDivElement>
    isCard?: boolean
    eclipse?: boolean
    phase?: number
    event?: string
}

export const CelestialIconsHandler: React.FC<CelestialIconsProps> = ({
    timeObj,
    parentRef,
    isCard,
}: CelestialIconsProps) => {
    //TODO: Need a static and dynamic version of this, static for cards, dynamic for main, for better handling of state
    const ref = React.useRef<HTMLDivElement>(null)

    const palette = useTheme().palette
    //TODO: Should probably handle client scaling higher up the tree
    const width = parentRef?.current?.clientWidth || window.innerWidth
    const height = parentRef?.current?.clientHeight || window.innerHeight
    //const { innerWidth: width, innerHeight: height } = window
    const isDay =
        timeObj?.getIsDay?.() ?? palette.mode === 'light' ? true : false
    const timePercent = timeObj?.getTimePercent?.() ?? 0.66

    const xScale = width / 300
    const yScale = height / 300
    const avgScale = (xScale + yScale) / 2
    const iconScaledX = xScale > 3 ? 20 * xScale : 60
    const [p0, p1, p2, p3] = [
        { x: 0 * xScale, y: 90 * yScale },
        { x: 100 * xScale, y: 0 * yScale },
        { x: 200 * xScale, y: 0 * yScale },
        { x: 300 * xScale, y: 90 * yScale },
    ]
    const cardPos = { x: 50 * xScale, y: 45 * yScale }
    const bezierPos =
        timePercent === undefined
            ? cardPos
            : bezierCurve(timePercent, p0, p1, p2, p3)
    let bezierPath = ''
    for (let i = 0; i < 1.01; i += 0.01) {
        const { x, y } = bezierCurve(i, p0, p1, p2, p3)
        bezierPath += `L${x} ${y}`
    }

    return (
        <svg
            className={styles.CelestialsSVG}
            style={{
                marginTop: isCard ? '0' : '4rem',
            }}
            width={width}
            height={height}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={`M${p0.x} ${p0.y} ${bezierPath}`} stroke="#111" />
            <foreignObject
                className={styles.svgIconObject}
                x={bezierPos.x}
                y={bezierPos.y}
            >
                <div
                    className={styles.iconWrapper}
                    ref={ref}
                    style={{
                        overflow: 'visible',
                        width: iconScaledX,
                        height: iconScaledX,
                        top: -iconScaledX * 0.5,
                        left: -iconScaledX * 0.5,
                    }}
                >
                    <CelestialIcon
                        isDay={isDay!}
                        size={iconScaledX}
                        parentRef={ref}
                    />
                </div>
            </foreignObject>
        </svg>
    )
}

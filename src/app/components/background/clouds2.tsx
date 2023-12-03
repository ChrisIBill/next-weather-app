/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import './clouds2.scss'
import { bezierCurve } from '@/lib/lib'
import { TimeObjectType } from '@/lib/time'
import { jsx, css, Global, keyframes } from '@emotion/react'
import { useTheme } from '@mui/material'
import { useWindowDimensions } from '@/lib/hooks'
import { BackgroundComponentsProps } from './background'

export interface Clouds2Props {
    index: number
    width: number
    height: number
    baseHeight: number
    color: string
    zIndex?: number
    scale?: number
    arch: number
    startPos: number
}
export const Clouds2: React.FC<Clouds2Props> = ({
    index,
    width,
    height,
    baseHeight,
    color,
    zIndex = 0,
    scale = 1,
    arch,
    startPos,
}: Clouds2Props) => {
    const speed = 8 + index * 3 + Math.random() * 2
    const cloudsKeyframe = keyframes`
        from {
            transform: translateX(${0}px);
                    }
        to {
            transform: translateX(${width}px);
        }
    `

    const points = [
        `M ${width} 0, ${-width * 2} 0`,
        `Q ${-width * 1.5} ${arch}`,
        `${-width} ${baseHeight}`,
        `Q ${-width * 0.5} ${arch}`,
        `0 ${baseHeight}`,
        `Q ${width * 0.5} ${arch}`,
        `${width} ${baseHeight}`,
        `Q ${width * 1.5} ${arch}`,
        `${width * 2} ${baseHeight}`,
        `L ${width * 2} 0`,
    ]
    const testPath = points.join(' ')

    return (
        <div
            className={'cloud${index+1}_wrapper'}
            css={css`
                animation: ${speed}s linear infinite forwards ${cloudsKeyframe};
            `}
            style={{
                position: 'absolute',
                zIndex: zIndex,
                left: `${-startPos}px`,
                overflow: 'visible',
            }}
        >
            <svg
                className={`clouds2 cloud${index + 1}`}
                style={{
                    overflow: 'visible',
                }}
                width={width * 4}
                height={height}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d={testPath} fill={color} style={{}} />
            </svg>
        </div>
    )
}

export interface Clouds2GeneratorProps extends BackgroundComponentsProps {
    cloudCover: number
}

export const Clouds2Generator: React.FC<Clouds2GeneratorProps> = (props) => {
    const palette = useTheme().palette
    const windowDimensions = useWindowDimensions()
    const numClouds = Math.round(props.cloudCover / 25)
    const [xScale, yScale] = [props.xScale, props.yScale]
    const width = xScale * 100

    useEffect(() => {}, [windowDimensions])
    const clouds = new Array(numClouds).fill(0).map((e, i) => {
        const startPos = (i / numClouds) * 100 * xScale
        const baseHeight = (5 + 10 * (i + 1) + Math.random() * 5) * yScale
        const height = yScale * 20 + baseHeight
        const arch = 10 * Math.random() + yScale * 10 + baseHeight
        console.log('Cloud stats: ', arch, baseHeight, height)

        return (
            <Clouds2
                key={i}
                index={i}
                width={width}
                height={height}
                baseHeight={baseHeight}
                color={palette.grey[(i + 1) * 100]}
                zIndex={5 - i}
                startPos={startPos}
                scale={xScale}
                arch={arch}
            />
        )
    })
    return <div className={'clouds'}>{clouds}</div>
}

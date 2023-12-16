/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import styles from './clouds.module.scss'
import { bezierCurve, hsl } from '@/lib/lib'
import { TimeObjectType } from '@/lib/time'
import { jsx, css, Global, keyframes } from '@emotion/react'
import { useTheme } from '@mui/material'
import { useWindowDimensions } from '@/lib/hooks'
import { BackgroundComponentsProps } from './background'
import { useForecastObjStore } from '@/lib/stores'
import {
    CLOUD_COLOR_MAP,
    CloudClassType,
    getCloudColor,
    hslType,
} from '@/lib/obj/cloudClass'
import { DailyWeatherForecastObjectType } from '@/lib/interfaces'

export interface CloudsProps {
    index: number
    width: number
    height: number
    baseHeight: number
    isCard?: boolean
    zIndex?: number
    scale?: number
    arch: number
    startPos: number
    cloudCover?: number
}
export const Clouds: React.FC<CloudsProps> = ({
    index,
    width,
    height,
    baseHeight,
    zIndex = 0,
    scale = 1,
    arch,
    startPos,
    isCard,
}: CloudsProps) => {
    console.log('Clouds')
    const windSpeed = useForecastObjStore((state) => state.windMagnitude.state)
    const speed = 15 - windSpeed + index * 7 + Math.random() * 2
    const cloudsKeyframe = keyframes`
        from {
            webkitTransform: translateX(${0}px);
            transform: translateX(${0}px);
                    }
        to {
            webkitTransform: translateX(${width}px);
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
            className={styles.clouds}
            css={css`
                -webkit-animation: ${speed}s linear infinite forwards
                    ${cloudsKeyframe};
                will-change: transform;
            `}
            style={{
                zIndex: zIndex,
                left: `${-startPos}px`,
            }}
        >
            <CloudStateWrapper
                testPath={testPath}
                index={index}
                width={width}
                height={height}
                isCard={isCard}
            />
        </div>
    )
}

export interface CloudWrapperProps {
    testPath: string
    index: number
    width: number
    height: number
    isCard?: boolean
    forecastObj?: DailyWeatherForecastObjectType
    cloudLightness?: number
}

const CloudStateWrapper: React.FC<CloudProps> = (props) => {
    return props.isCard ? (
        <CloudCardStateWrapper {...props} />
    ) : (
        <CloudPageStateWrapper {...props} />
    )
}
const CloudCardStateWrapper: React.FC<CloudProps> = (props) => {
    const state = props.forecastObj?.cloudObj.getCloudLightness()
    return <Cloud {...props} cloudLightness={state} />
}
const CloudPageStateWrapper: React.FC<CloudProps> = (props) => {
    const cloudColor = useForecastObjStore(
        (state) => state.cloudLightness.state
    )
    return <Cloud {...props} cloudLightness={cloudColor} />
}

export interface CloudProps {
    testPath: string
    index: number
    width: number
    height: number
    isCard?: boolean
    forecastObj?: DailyWeatherForecastObjectType
    cloudLightness?: number
    animation: string
}
export const Cloud: React.FC<CloudProps> = (props) => {
    const palette = useTheme().palette
    const cloudColor = `hsl(0, 0%, ${
        //Sets luminance value of cloud color based on cloud index and weather code
        (props.cloudLightness ?? 99) -
        props.index * 7 -
        (palette.mode === 'dark' ? 15 : 0)
    }%)`

    return (
        <svg
            className={styles.cloud}
            width={props.width * 4}
            height={props.height}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={props.testPath} fill={cloudColor} style={{}} />
        </svg>
    )
}

export interface CloudsGeneratorProps extends BackgroundComponentsProps {
    cloudCover?: number
}

export const CloudsGenerator: React.FC<CloudsGeneratorProps> = (props) => {
    console.log('Cloud Generator: ', props.cloudCover)
    const windowDimensions = useWindowDimensions()
    const numClouds = Math.round((props.cloudCover ?? 0) / 25)
    const [xScale, yScale] = [props.xScale, props.yScale]
    const width = xScale * 100

    useEffect(() => {}, [windowDimensions])
    const clouds = new Array(numClouds).fill(0).map((e, i) => {
        const startPos = (i / numClouds) * 100 * xScale
        const baseHeight = (5 + 10 * i) * yScale
        const height = yScale * 10 * (i + 1) + baseHeight
        const arch = yScale * 20 + yScale * 10 + baseHeight

        return (
            <Clouds
                key={i}
                index={i}
                width={width}
                height={height}
                baseHeight={baseHeight}
                zIndex={5 - i}
                startPos={startPos}
                scale={xScale}
                arch={arch}
            />
        )
    })
    return <div className={'clouds'}>{clouds}</div>
}

export interface CloudsStateWrapper extends BackgroundComponentsProps {
    forecastObj?: DailyWeatherForecastObjectType
}

export const CloudsGeneratorStateWrapper: React.FC<CloudsStateWrapper> = (
    props
) => {
    return props.isCard ? (
        <CloudsGeneratorCardStateWrapper {...props} />
    ) : (
        <CloudsGeneratorPageStateWrapper {...props} />
    )
}

export const CloudsGeneratorCardStateWrapper: React.FC<CloudsStateWrapper> = (
    props
) => {
    const state = props.forecastObj?.cloudObj
    return (
        <div className={'clouds'}>
            <CloudsGenerator {...props} cloudCover={state?.cloudCover} />
        </div>
    )
}
export const CloudsGeneratorPageStateWrapper: React.FC<
    BackgroundComponentsProps
> = (props) => {
    const cloudCover = useForecastObjStore(
        (state) => state.cloudMagnitude.state
    )
    return (
        <div className={'clouds'}>
            <CloudsGenerator {...props} cloudCover={cloudCover} />
        </div>
    )
}

/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react'
import styles from './clouds.module.scss'
import { useTheme } from '@mui/material'
import { BackgroundComponentsProps } from './background'
import { useForecastObjStore } from '@/lib/obj/forecastStore'
import { DailyWeatherForecastObjectType } from '@/lib/interfaces'

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
    const state = props.forecastObj?.cloudObj.cloudCover ?? 0
    return (
        <div className={'clouds'}>
            <CloudsGenerator {...props} cloudCover={state} />
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

export interface CloudsGeneratorProps extends BackgroundComponentsProps {
    forecastObj?: DailyWeatherForecastObjectType
    cloudCover: number
    cloudLightness?: number
    isCard?: boolean
}

export const CloudsGenerator: React.FC<CloudsGeneratorProps> = (props) => {
    const numClouds = 4
    const cloudMagnitude = Math.floor(props.cloudCover / 25)

    const clouds = useMemo(
        () =>
            new Array(numClouds).fill(0).map((e, i) => {
                const baseHeight = 10 + 5 * i
                const height = 10 * (i + 1) + baseHeight
                const arch = 30 + i * 2 + baseHeight

                return (
                    <CloudContainer
                        forecastObj={props.forecastObj}
                        key={i}
                        index={i}
                        width={props.width}
                        height={props.height}
                        cloudHeight={height}
                        baseHeight={baseHeight}
                        zIndex={5 - i}
                        isCard={props.isCard}
                        arch={arch}
                    />
                )
            }),
        [props.width, props.height, props.isCard, props.forecastObj]
    )
    return (
        <div
            className={'clouds'}
            style={{
                width: props.width,
                height: props.height,
            }}
        >
            {clouds.slice(0, cloudMagnitude)}
        </div>
    )
}

export interface CloudsProps {
    forecastObj?: DailyWeatherForecastObjectType
    index: number
    width: number
    height: number
    baseHeight: number
    isCard?: boolean
    zIndex: number
    arch: number
    cloudCover?: number
    cloudHeight?: number
}
const CloudContainer: React.FC<CloudsProps> = React.memo(
    function CloudContainerMemo(props: CloudsProps) {
        const points = [
            `M 100 0 L -100 0`,
            `-100 ${props.baseHeight}`,
            `Q -50 ${props.arch}`,
            `0 ${props.baseHeight}`,
            `Q 50 ${props.arch}`,
            `100 ${props.baseHeight}`,
            `L 100 0`,
        ]
        const testPath = points.join(' ')
        return (
            <CloudStateWrapper
                testPath={testPath}
                index={props.index}
                width={props.width}
                height={props.height}
                isCard={props.isCard}
                forecastObj={props.forecastObj}
                zIndex={props.zIndex}
            />
        )
    }
)

export interface CloudWrapperProps {
    testPath: string
    index: number
    width: number
    height: number
    isCard?: boolean
    forecastObj?: DailyWeatherForecastObjectType
    cloudLightness?: number
    zIndex: number
}

const CloudStateWrapper: React.FC<CloudWrapperProps> = (props) => {
    return props.isCard ? (
        <CloudCardStateWrapper {...props} />
    ) : (
        <CloudPageStateWrapper {...props} />
    )
}
const CloudCardStateWrapper: React.FC<CloudWrapperProps> = (props) => {
    const cloudLightness = props.forecastObj?.cloudObj.getCloudLightness() ?? 0
    const windSpeed = props.forecastObj?.windObj?._beaufort()[0] ?? 0
    return (
        <Cloud
            {...props}
            cloudLightness={cloudLightness}
            windMagnitude={windSpeed}
        />
    )
}
const CloudPageStateWrapper: React.FC<CloudWrapperProps> = (props) => {
    const cloudColor = useForecastObjStore(
        (state) => state.cloudLightness.state
    )
    const windSpeed = useForecastObjStore((state) => state.windMagnitude.state)
    return (
        <Cloud
            {...props}
            cloudLightness={cloudColor}
            windMagnitude={windSpeed}
        />
    )
}

export interface CloudProps {
    testPath: string
    index: number
    width: number
    height: number
    isCard?: boolean
    forecastObj?: DailyWeatherForecastObjectType
    cloudLightness?: number
    windMagnitude: number
    zIndex: number
}
export const Cloud: React.FC<CloudProps> = (props) => {
    const palette = useTheme().palette

    const speed = 15 - props.windMagnitude + props.index * 7 + Math.random() * 2
    const cloudColor = `hsl(0, 0%, ${
        //Sets luminance value of cloud color based on cloud index and weather code
        (props.cloudLightness ?? 99) -
        props.index * 7 -
        (palette.mode === 'dark' ? 15 : 0)
    }%)`
    //const isVisible = Math.floor((props.cloudCover ?? 0) / 30) >= props.index

    return (
        <div
            className={styles.clouds}
            style={{
                width: props.width,
                height: props.height,
                zIndex: props.zIndex,
                animationDuration: `${speed}s`,
                left: '0',
            }}
        >
            <div
                style={{
                    width: props.width,
                    height: props.height,
                    //visibility: isVisible ? 'visible' : 'hidden',
                }}
            >
                <svg
                    className={styles.cloud}
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={`0 0 100 100`}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                >
                    <path
                        d={props.testPath}
                        fill={cloudColor}
                        width="100"
                        height="100"
                    />
                </svg>
            </div>
        </div>
    )
}

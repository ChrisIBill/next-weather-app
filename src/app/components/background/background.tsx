'use client'
import Image from 'next/image'
import React, { useEffect, useCallback } from 'react'
import styles from './background.module.scss'
import { ColorLayerWrapper, DayNightColorLayer } from './dayNightColorLayer'
import { RainBackground, RainBackgroundStateWrapper } from '@/app/rain'
import { DailyWeatherForecastObjectType } from '@/lib/interfaces'
import { useWindowDimensions } from '@/lib/hooks'
import { CloudsGeneratorStateWrapper } from './clouds'
import PrecipitationClass, {
    DEFAULT_PRECIPITATION_CLASS,
} from '@/lib/obj/precipitation'
import frozenImageOverlay from '/public/frozen-corner-1.png'
import dynamic from 'next/dynamic'
import { CelestialIconsHandlerProps } from './celestialIcons'

export interface BackgroundProps {
    forecastObj?: DailyWeatherForecastObjectType
    isCard?: boolean
    //timeObj: DayTimeClassType[]
}

/** @interface BackgroundComponentsProps
 * @param {number} xScale - The xScale of the background, used to scale the background to the size of the container.
 * @param {number} yScale - The yScale of the background, used to scale the background to the size of the container.
 * @param {number} width - The width of the container.
 * @param {number} height - The height of the container.
 **/
export interface BackgroundComponentsProps {
    xScale: number
    yScale: number
    width: number
    height: number
    isCard?: boolean
}

//Background occurs in 3 contexts, main landing page, weather page, and weather card.
//After initial load, the weather cards are pretty much static, so we don't need to worry about updating them, just generating them.
//as such they can be generated directly from the passed forecastObj.
//The main landing page and weather page are dynamic, so we need to update them.
//These updates are expensive, so if any specific data hasn't changed, we don't need to update that part of the background.
//as such these components use the forecastObjStore to hook into their respective states. which ideally are only updated when the data changes.
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
    const windObj = props.forecastObj?.windObj
    const cloudObj = props.forecastObj?.cloudObj
    const timeObj = props.forecastObj?.timeObj
    const tempObj = props.forecastObj?.temperatureObj

    //TODO: Should probably handle client scaling higher up the tree

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
    }, [props.isCard])

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
                windObj={windObj}
                xScale={xScale}
                yScale={yScale}
                width={width}
                height={height}
            />
            <CloudsGeneratorStateWrapper
                xScale={xScale}
                forecastObj={props.forecastObj}
                isCard={props.isCard}
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
    wrapperWidth: number
    wrapperHeight: number
}

const CelestialIconsHandlerDynamic = dynamic<CelestialIconsHandlerProps>(
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
            <CelestialIconsHandlerDynamic
                //timeObj={props.timeObj}
                parentRef={ref}
                isCard={props.isCard}
                wrapperWidth={props.wrapperWidth}
                wrapperHeight={props.wrapperHeight}
            />
            <ColorLayerWrapper isCard={props.isCard} />
        </div>
    )
}

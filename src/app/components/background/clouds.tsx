import React from 'react'
import styles from './clouds.module.scss'
import { useTheme } from '@/lib/context'
import paletteHandler from '@/lib/paletteHandler'
export interface CloudsProps {
    cloudCover: number
    windSpeed?: number
    theme?: string
    palette?: any
}
//export const Clouds: React.FC<CloudsProps> = (props: CloudsProps) => {
//    const theme = useTheme()
//    const palette = paletteHandler(theme.theme)
//    return (
//        <div className={styles.cloudsContainer} data-theme={theme.theme}>
//            <CloudLayerGenerator
//                cloudCover={props.cloudCover}
//                windSpeed={props.windSpeed}
//                theme={theme.theme}
//                palette={palette}
//            />
//        </div>
//    )
//}

export const Clouds = (props: CloudsProps) => {
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)
    const numMult = props.cloudCover / 100
    const NUM_CLOUDS = 25 * numMult
    const clouds = Array(NUM_CLOUDS)
        .fill(undefined)
        .map((_cloud, index) => (
            <CloudGenerator
                key={`cloud-${index}`}
                index={index}
                cloudCover={numMult}
                theme={theme.theme}
                palette={palette}
            />
        ))
    return <ul className={styles.cloudsContainer}>{clouds}</ul>
}

interface CloudProps {
    cloudCover: number
    index: number
    theme?: string
    palette?: any
}

const CloudGenerator = (props: CloudProps) => {
    const sizeScale = Math.random()
    const animationTime = Math.random() * 15 + 15 * sizeScale + 20
    const height = sizeScale * props.cloudCover + 3
    const width = Math.random() * 20 * props.cloudCover + 10 * sizeScale + 10
    const top = Math.random() * 100
    const isDouble = Math.random() > 0.5
    return isDouble ? (
        <div
            className={styles.cloudWrapper}
            data-theme={props.theme}
            style={{
                width: `${width * 1.5}rem`,
                height: `${height * 1.5}rem`,
                top: `${top}%`,
                animationDelay: `${Math.random() * 20 + 3}s`,
                animationDuration: `${animationTime}s`,
            }}
        >
            <div
                className={styles.cloud}
                style={{
                    width: `${width}rem`,
                    height: `${height}rem`,
                    borderRadius: `${height * 0.67}rem / ${height * 0.67}rem`,
                    zIndex: `${props.index + 5}`,
                    backgroundColor: `${props.palette.background}`,
                    position: 'relative',
                }}
            ></div>
            <div
                className={styles.cloud}
                style={{
                    width: `${width}rem`,
                    height: `${height}rem`,
                    borderRadius: `${height * 0.67}rem / ${height * 0.67}rem`,
                    zIndex: `${props.index + 5}`,
                    backgroundColor: `${props.palette.background}`,
                    position: 'relative',
                    top: `-${height * 0.5}rem`,
                    left: `${
                        Math.random() > 0.5 ? width * 0.33 : -width * 0.33
                    }rem`,
                }}
            ></div>
        </div>
    ) : (
        <div
            className={styles.cloudWrapper}
            data-theme={props.theme}
            style={{
                width: `${width}rem`,
                height: `${height}rem`,
            }}
        >
            <div
                className={styles.cloud}
                style={{
                    width: `${width}rem`,
                    height: `${height}rem`,
                    borderRadius: `${height * 0.67}rem / ${height * 0.67}rem`,
                    zIndex: `${props.index + 5}`,
                    backgroundColor: `${props.palette.background}`,
                    position: 'static',
                }}
            ></div>
        </div>
    )
}

export const CloudsTest: React.FC<CloudsProps> = (props: CloudsProps) => {
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)
    return (
        <div
            data-theme={theme.theme}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <CloudTestGenerator
                cloudCover={props.cloudCover}
                windSpeed={props.windSpeed}
                theme={theme.theme}
                palette={palette}
            />
        </div>
    )
}

export const CloudTestGenerator = (props: CloudsProps) => {
    const numMult = props.cloudCover / 100
    const NUM_CLOUDS = 50 * numMult
    const clouds = Array(NUM_CLOUDS)
        .fill(undefined)
        .map((_cloud, index) => (
            <CloudGenerator
                key={`cloud-${index}`}
                index={index}
                cloudCover={numMult}
                theme={props.theme}
                palette={props.palette}
            />
        ))
    console.log('Clouds: ', clouds)
    return (
        <ul
            className={styles.cloudsLayer}
            style={{
                margin: '1rem',
                height: 'fit-content',
                position: 'relative',
            }}
        >
            {clouds}
        </ul>
    )
}

import React from 'react'
import styles from './clouds.module.scss'
import { useTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import { Color } from '@mui/material'
export interface CloudsProps {
    cloudCover: number
    isCard?: boolean
    windSpeed?: number
    size?: string
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
    const palette = useTheme().palette
    const cloudColor = palette.mode === 'dark' ? grey[400] : grey[200]
    const numMult = props.cloudCover / 100
    const NUM_CLOUDS = Math.floor(25 * numMult)
    const clouds = Array(NUM_CLOUDS)
        .fill(undefined)
        .map((_cloud, index) => (
            <CloudGenerator
                key={`cloud-${index}`}
                index={index}
                size={props.size}
                cloudCover={numMult}
                theme={palette.mode}
                cloudColor={cloudColor}
            />
        ))
    return (
        <ul
            className={styles.cloudsContainer}
            style={{
                top: props.isCard ? '15%' : '20rem',
            }}
        >
            {clouds}
        </ul>
    )
}

interface CloudProps {
    cloudCover: number
    index: number
    size?: string
    theme?: string
    cloudColor?: string
}

const CloudGenerator = (props: CloudProps) => {
    const sizeScale = props.size === 'small' ? 0.2 : 1
    const rndScale = Math.random()
    const animationTime = Math.random() * 15 + 15 * rndScale + 20
    const height = (rndScale * props.cloudCover + 3) * sizeScale
    const width =
        (Math.random() * 20 * props.cloudCover + 10 * rndScale + 10) * sizeScale
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
                    backgroundColor: `${props.cloudColor}`,
                    position: 'relative',
                }}
            ></div>
            <div
                className={styles.cloud}
                style={{
                    width: `${width}rem`,
                    height: `${height}rem`,
                    borderRadius: `${height * 0.67}rem / ${height * 0.67}rem`,
                    backgroundColor: `${props.cloudColor}`,
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
                    backgroundColor: `${props.cloudCover}`,
                    position: 'static',
                }}
            ></div>
        </div>
    )
}

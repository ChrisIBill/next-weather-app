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
export const Clouds: React.FC<CloudsProps> = (props: CloudsProps) => {
    const theme = useTheme()
    const palette = paletteHandler(theme.theme)
    const CloudLayer1 = () => {
        const lengths = []
        const delays = []
        const runtime = Math.random() * 15 + 20
        for (let i = 0; i < 10; i++) {
            lengths.push(Math.random() * 5 + 7)
            delays.push(Math.random() * 5 + 3)
        }
    }
    return (
        <div className={styles.cloudsWrapper} data-theme={theme.theme}>
            <CloudLayerGenerator
                cloudCover={props.cloudCover}
                windSpeed={props.windSpeed}
                theme={theme.theme}
                palette={palette}
            />
        </div>
    )
}

const CloudLayerGenerator = (props: CloudsProps) => {
    const numMult = props.cloudCover / 100
    const NUM_CLOUDS = 50 * numMult
    const animationTime = Math.random() * 15 + 20
    const clouds = Array(NUM_CLOUDS)
        .fill(undefined)
        .map((cloud, index) => (
            <div
                key={`cloud-${index}`}
                className={styles.cloud}
                data-theme={props.theme}
                style={
                    {
                        top: `${Math.random() * 30 + 20}%`,
                        width: `${Math.random() * 10 * numMult + 7}rem`,
                        height: `${Math.random() * 2 * numMult + 2.5}rem`,
                        animationDelay: `${Math.random() * 28 + 3}s`,
                        animationDuration: `${Math.random() * 15 + 40}s`,
                        zIndex: `${index + 5}`,
                        backgroundColor: `${props.palette.background}`,
                        borderColor: `${props.palette.textPrimary}`,
                        //boxShadow: `inset 0px -10px 15px 0px ${props.palette.textPrimary}F0`,
                    } as React.CSSProperties
                }
            ></div>
        ))
    return <ul className={styles.cloudsLayer}>{clouds}</ul>
}

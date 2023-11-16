import React from 'react'
import styles from './clouds.module.scss'
import { useTheme } from '@/lib/context'
import paletteHandler from '@/lib/paletteHandler'
export interface CloudsProps {
    cloudCover: number
    theme?: string
}
export const Clouds: React.FC<CloudsProps> = (props: CloudsProps) => {
    const theme = useTheme()
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
        <div className={styles.cloudsWrapper}>
            <CloudLayerGenerator
                cloudCover={props.cloudCover}
                theme={theme.theme}
            />
        </div>
    )
}

const CloudLayerGenerator = (props: CloudsProps) => {
    const NUM_CLOUDS = 10
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
                        '--cloudWidth': `${Math.random() * 5 + 7}rem`,
                        '--cloudHeight': `${3.5 - index / 10}rem`,
                        '--delay': `${Math.random() * 17 + 3}s`,
                        '--animationSpeed': `${animationTime}s`,
                        '--zIndex': `${index + 5}`,
                    } as React.CSSProperties
                }
            ></div>
        ))
    return <ul className={styles.cloudsLayer}>{clouds}</ul>
}

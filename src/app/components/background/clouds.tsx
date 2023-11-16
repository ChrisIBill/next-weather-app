import React from 'react'
import styles from './clouds.module.scss'
export interface CloudsProps {
    cloudCover: number
}
export const Clouds: React.FC<CloudsProps> = () => {
    return (
        <div className={styles.cloudsWrapper}>
            <div
                className={styles.cloud}
                style={
                    {
                        '--width': '12rem',
                    } as React.CSSProperties
                }
            ></div>
        </div>
    )
}

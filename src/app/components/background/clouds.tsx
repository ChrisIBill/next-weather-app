import React from 'react'
import styles from './clouds.module.scss'
export interface CloudsProps {
    cloudCover: number
}
export const Clouds: React.FC<CloudsProps> = () => {
    return (
        <div className={styles.cloudsWrapper}>
            <div className={styles.clouds_1}></div>
            <div className={styles.clouds_2}></div>
            <div className={styles.clouds_3}></div>
        </div>
    )
}

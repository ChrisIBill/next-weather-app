import React from 'react'
import styles from './icons.module.scss'
import { PosCoordinates } from '@/lib/interfaces'

export interface IconProps {
    isDay: boolean
    phase?: number
    eclipse?: boolean
    condition?: string
}
export interface MoonIconProps {
    phase?: number
    eclipse?: boolean
    condition?: string
}
export const MoonIcon: React.FC<MoonIconProps> = ({
    condition,
}: MoonIconProps) => {
    return (
        <div className={styles.moonIcon}>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
        </div>
    )
}
export interface SunIconProps {
    eclipse?: boolean
    condition?: string
}
export const SunIcon: React.FC<SunIconProps> = ({
    eclipse,
    condition,
}: SunIconProps) => {
    return <div className={styles.sunIcon}></div>
}

export const CelestialIcon: React.FC<IconProps> = ({ isDay }: IconProps) => {
    return (
        <div className={styles.iconWrapper}>
            {isDay ? <SunIcon /> : <MoonIcon />}
        </div>
    )
    return
}

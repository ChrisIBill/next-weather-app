import React from 'react'
import styles from './icons.module.scss'
import { PosCoordinates } from '@/lib/interfaces'

export interface IconProps {
    pos?: PosCoordinates
    xScale?: number
    yScale?: number
    width?: number
    height?: number
}
export interface MoonIconProps extends IconProps {
    phase?: number
    eclipse?: boolean
    condition?: string
}
export const MoonIcon: React.FC<MoonIconProps> = ({
    pos,
    xScale,
    yScale,
    width,
    height,
    phase,
    condition,
}: MoonIconProps) => {
    return (
        <div className={styles.moonIcon}>
            <div className={styles.moonIcon_crater}></div>
        </div>
    )
}
export interface SunIconProps extends IconProps {
    eclipse?: boolean
    condition?: string
}
export const SunIcon: React.FC<SunIconProps> = ({
    pos,
    xScale,
    yScale,
    width,
    height,
    eclipse,
    condition,
}: SunIconProps) => {
    return <div className={styles.sunIcon}></div>
}

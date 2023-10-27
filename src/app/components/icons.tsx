import React from 'react'
import styles from './icons.module.css'
import { useCircularInputContext } from 'react-circular-input'
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
    return <div className={styles.moon}></div>
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
    return <div className={styles.sunIcon}>Sun</div>
}

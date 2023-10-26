import React from 'react'
import styles from './icons.module.css'
import { useCircularInputContext } from 'react-circular-input'

export interface MoonIconProps {
    inputContext?: any
    phase?: number
    eclipse?: boolean
}
export const MoonIcon: React.FC<MoonIconProps> = ({
    inputContext,
    phase,
}: MoonIconProps) => {
    return <div className={styles.moon}>Moon</div>
}
export interface SunIconProps {
    inputContext?: any
    eclipse?: boolean
}
export const SunIcon: React.FC<SunIconProps> = ({
    inputContext,
    eclipse,
}: SunIconProps) => {
    return <div className={styles.sunIcon}>Sun</div>
}

import React from 'react'
import styles from './icons.module.css'

export interface MoonIconProps {
    phase: number
    eclipse?: boolean
}
const MoonIcon: React.FC<MoonIconProps> = ({ phase }: MoonIconProps) => {
    return <div className={styles.moon}></div>
}
export interface SunIconProps {
    eclipse?: boolean
}
const SunIcon: React.FC<SunIconProps> = ({ eclipse }: SunIconProps) => {
    return <div className={styles.sunIcon}></div>
}

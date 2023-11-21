import React from 'react'
import styles from './icons.module.scss'
import { PosCoordinates } from '@/lib/interfaces'

export interface IconProps {
    isDay: boolean
    size: number
    parentRef?: React.RefObject<HTMLDivElement>
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
        <div className={styles.moonIcon} style={{}}>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
        </div>
    )
}
export interface SunIconProps {
    size: number
    parentRef?: React.RefObject<HTMLDivElement>
    eclipse?: boolean
    condition?: string
}
export const SunIcon: React.FC<SunIconProps> = ({
    size,
    parentRef,
    eclipse,
    condition,
}: SunIconProps) => {
    //console.log('ParentRef: ', parentRef)
    return (
        <div
            className={styles.sunIcon}
            style={
                {
                    '--icon_size': `${size * 0.5}px`,
                    '--ray_length': `${size * 0.1}px`,
                    '--ray_offset': `${size * 0.1}px`,
                    border: `${size * 0.05}px solid #fff`,
                } as React.CSSProperties
            }
        ></div>
    )
}

export const CelestialIcon: React.FC<IconProps> = ({
    isDay,
    size,
    parentRef,
}: IconProps) => {
    return isDay ? <SunIcon size={size} parentRef={parentRef} /> : <MoonIcon />
}

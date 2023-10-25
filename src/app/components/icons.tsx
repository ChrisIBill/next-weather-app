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
    // console.log('inputContext')
    // console.log(inputContext)
    // const {
    //     value,
    //     radius,
    //     center,
    //     isFocused,
    //     setFocused,
    //     onChange,
    //     getPointFromValue,
    //     getValueFromPointerEvent,
    // } = inputContext()
    // const coords = getPointFromValue(value)
    // console.log('coords: ', coords)
    // const x = coords ? coords.x : 0
    // const y = coords ? coords.y : 0
    // return <text x={x} y={y} className={styles.moon}></text>
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

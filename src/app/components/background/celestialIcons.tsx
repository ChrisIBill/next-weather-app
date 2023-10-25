import './celestialIcons.css'
import { Slider, SliderRail, SliderTrack, styled } from '@mui/material'
import CircularSlider from '@fseehawer/react-circular-slider'
import {
    CircularInput,
    CircularTrack,
    CircularProgress,
    CircularThumb,
    useCircularInputContext,
} from 'react-circular-input'
import React from 'react'
import styles from './celestialIcons.module.scss'
import { MoonIcon, SunIcon } from '../icons'
//import dynamic from 'next/dynamic'
//const DynamicMoon = dynamic(() =>
//    import('../icons').then((mod) => mod.MoonIcon)
//)
//const DynamicSun = dynamic(() => import('../icons').then((mod) => mod.SunIcon))

export interface CelestialIconsProps {
    isDay: boolean
    timePercent: number
    eclipse?: boolean
    phase?: number
    event?: string
}

const CustomComponent = () => {
    const { getPointFromValue, value } = useCircularInputContext()
    const coords = getPointFromValue()
    const [x, y] = coords ? [coords.x, coords.y] : [0, 0]

    return (
        <text x={x} y={y} style={{ pointerEvents: 'none' }}>
            <MoonIcon />
        </text>
    )
}

export const CelestialIconsHandler: React.FC<CelestialIconsProps> = ({
    isDay,
    timePercent,
}: CelestialIconsProps) => {
    const [value, setValue] = React.useState<number>(0)
    const celestialRail = styled(SliderRail)(({ theme }) => ({
        backgroundColor: 'white',
    }))
    return (
        <div className={styles.wrapper}>
            <CircularInput value={value} onChange={setValue}>
                <CircularSlider trackColor="#fff" trackSize={10} width={700} />
                <CircularThumb />
                <CustomComponent />
                {/* isDay ? (
                    <SunIcon inputContext={useCircularInputContext} />
                ) : (
                    <MoonIcon inputContext={useCircularInputContext} />
                )*/}
            </CircularInput>
        </div>
    )
}

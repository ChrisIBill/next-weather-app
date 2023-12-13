import { Paper, Slider, Typography, useTheme } from '@mui/material'
import styles from './playgroundSliders.module.scss'
import { useForecastObjStore } from '@/lib/stores'
import React from 'react'

export interface PlaygroundSlidersProps {}
export const PlaygroundSliders: React.FC<PlaygroundSlidersProps> = (
    props: PlaygroundSlidersProps
) => {
    return (
        <Paper
            className={styles.sliderWrapper}
            sx={{
                padding: '1rem',
                position: 'relative',
                zIndex: 100,
            }}
        >
            <GenericPlaygroundSlider
                disabled
                label="Time"
                min={0}
                max={23}
                storeKey="time"
            />
            <GenericPlaygroundSlider
                disabled
                label="Temperature"
                min={-40}
                max={50}
                storeKey="temperature"
            />
            <GenericPlaygroundSlider
                label="Rain Volume"
                min={0}
                max={5}
                storeKey="rainMagnitude"
            />
            <GenericPlaygroundSlider
                disabled
                label="Snow Volume"
                min={0}
                max={5}
                storeKey="snowMagnitude"
            />
            <GenericPlaygroundSlider
                disabled
                label="Wind Speed"
                min={0}
                max={100}
                storeKey="windSpeed"
            />
            <GenericPlaygroundSlider
                label="Cloud Cover"
                min={0}
                max={100}
                storeKey="cloudCover"
            />
            <GenericPlaygroundSlider
                label="Cloud Color"
                min={30}
                max={99}
                storeKey="cloudLightness"
            />
        </Paper>
    )
}

interface GenericPlaygroundSliderProps {
    disabled?: boolean
    label: string
    min: number
    max: number
    storeKey: string
}

const GenericPlaygroundSlider: React.FC<GenericPlaygroundSliderProps> = (
    props: GenericPlaygroundSliderProps
) => {
    console.log('GenericPlaygroundSlider: ', props)
    const state = useForecastObjStore((state) => state[props.storeKey]['state'])
    const setState = useForecastObjStore(
        (state) => state[props.storeKey]['setState']
    )
    console.log('GenericPlaygroundSlider2: ', state, setState)
    return (
        <div className={styles.sliderWrapper}>
            <Typography>{props.label}</Typography>
            <Slider
                size="small"
                min={props.min}
                max={props.max}
                disabled={props.disabled}
                value={state}
                onChange={(event, newValue) => setState(newValue as number)}
                aria-label={`${props.label} Slider`}
            />
        </div>
    )
}

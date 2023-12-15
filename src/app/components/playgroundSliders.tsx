import { Paper, Slider, Typography, useTheme } from '@mui/material'
import styles from './playgroundSliders.module.scss'
import {
    ForecastStateKeysEnum,
    ForecastStateKeysType,
    useForecastObjStore,
} from '@/lib/stores'
import React from 'react'
import { DayTimeClassType } from '@/lib/obj/time'
import { DEFAULT_HOUR_DATA } from '@/lib/obj/constants'

export interface PlaygroundSlidersProps {
    timeObj?: DayTimeClassType[]
}
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
            <TimeSlider />
            <GenericPlaygroundSlider
                disabled
                label="Temperature"
                min={-40}
                max={50}
                storeKey={ForecastStateKeysEnum.temperatureMagnitude}
            />
            <GenericPlaygroundSlider
                label="Rain Volume"
                min={0}
                max={5}
                storeKey={ForecastStateKeysEnum.rainMagnitude}
            />
            <GenericPlaygroundSlider
                disabled
                label="Snow Volume"
                min={0}
                max={5}
                storeKey={ForecastStateKeysEnum.snowMagnitude}
            />
            <GenericPlaygroundSlider
                disabled
                label="Wind Speed"
                min={0}
                max={100}
                storeKey={ForecastStateKeysEnum.windMagnitude}
            />
            <GenericPlaygroundSlider
                label="Cloud Cover"
                min={0}
                max={100}
                storeKey={ForecastStateKeysEnum.cloudMagnitude}
            />
            <GenericPlaygroundSlider
                label="Cloud Color"
                min={30}
                max={99}
                storeKey={ForecastStateKeysEnum.cloudLightness}
            />
        </Paper>
    )
}

interface GenericPlaygroundSliderProps {
    disabled?: boolean
    label: string
    min: number
    max: number
    storeKey: ForecastStateKeysType
}

const GenericPlaygroundSlider: React.FC<GenericPlaygroundSliderProps> = (
    props: GenericPlaygroundSliderProps
) => {
    const state = useForecastObjStore((state) => state[props.storeKey]['state'])
    const setState = useForecastObjStore(
        (state) => state[props.storeKey]['setState']
    ) as (state: number) => void
    if (typeof state !== 'number') {
        console.error('State in generic slider is not a number: ', state, props)
        throw new Error('State in generic slider is not a number')
    }
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

export interface TimeSliderProps {
    timeObj: DayTimeClassType[]
}

const TimeSlider: React.FC<{}> = () => {
    const [hour, setHour] = React.useState<number>(12)
    const setState = useForecastObjStore((state) => state.time.setState)
    const setTimePercent = useForecastObjStore(
        (state) => state.timePercent.setState
    )
    const setIsDay = useForecastObjStore((state) => state.isDay.setState)

    const handleChange = (event: Event, newValue: number) => {
        setHour(newValue as number)
        const hour = DEFAULT_HOUR_DATA[newValue as number]
        //setState([0, newValue as number])
        setTimePercent(hour._timePercent)
        setIsDay(hour._isDay)
    }

    return (
        <div className={styles.sliderWrapper}>
            <Typography>Time</Typography>
            <Slider
                size="small"
                min={0}
                max={23}
                value={hour}
                onChange={(e, val) => handleChange(e, val as number)}
            />
        </div>
    )
}

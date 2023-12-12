'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.scss'
import { RainBackground } from './rain'
import { useContext, useState } from 'react'
import { Background } from './components/background/background'
import { PlaygroundSliders } from './components/playgroundSliders'
import { HourlyForecastObjectType } from '@/lib/interfaces'
import DayTimeClass from '@/lib/obj/time'
import { HourTemperatureClass } from '@/lib/obj/temperature'
import PrecipitationClass from '@/lib/obj/precipitation'
import WindClass from '@/lib/obj/wind'

export default function Home() {
    const timeObj = new DayTimeClass(0)
    const [time, setTime] = useState<number>(12)
    const [temperature, setTemperature] = useState<number>(20) //range -40 to 50
    const [rainVolume, setRainVolume] = useState<number>(0) //range 0 to 50
    const [snowVolume, setSnowVolume] = useState<number>(0) //range 0 to 50
    const [windSpeed, setWindSpeed] = useState<number>(0) //range 0 to 50
    const [cloudCover, setCloudCover] = useState<number>(0) //range 0 to 50

    const temperatureObj = new HourTemperatureClass(temperature, temperature)
    const precipitationObj = new PrecipitationClass(rainVolume, snowVolume)
    const windObj = new WindClass([windSpeed, windSpeed], 0)
    const timeHourObj = timeObj.hours[time]

    const handleTimeChange = (event: any, newValue: number) => {
        setTime(newValue as number)
    }
    const handleTemperatureChange = (event: any, newValue: number) => {
        setTemperature(newValue as number)
    }
    const handleRainVolumeChange = (event: any, newValue: number) => {
        setRainVolume(newValue as number)
    }
    const handleSnowVolumeChange = (event: any, newValue: number) => {
        setSnowVolume(newValue as number)
    }
    const handleWindSpeedChange = (event: any, newValue: number) => {
        setWindSpeed(newValue as number)
    }
    const handleCloudCoverChange = (event: any, newValue: number) => {
        setCloudCover(newValue as number)
    }

    return (
        <div className={styles.landingPage} style={{}}>
            <PlaygroundSliders
                forecastVars={{
                    time,
                    temperature,
                    rainVolume,
                    snowVolume,
                    windSpeed,
                    cloudCover,
                }}
                changeHandlers={{
                    handleTimeChange,
                    handleTemperatureChange,
                    handleRainVolumeChange,
                    handleSnowVolumeChange,
                    handleWindSpeedChange,
                    handleCloudCoverChange,
                }}
            />
            <Background
                forecastObj={{
                    timeObj: timeHourObj,
                    temperatureObj,
                    precipitationObj,
                    windObj,
                }}
            />
        </div>
    )
}

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

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        console.log(newValue)
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
                handleSliderChange={handleSliderChange}
            />
            <Background
                forecastObj={{
                    timeObj,
                    temperatureObj,
                    precipitationObj,
                    windObj,
                }}
            />
        </div>
    )
}

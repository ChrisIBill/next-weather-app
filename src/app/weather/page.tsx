'use client'
import { useEffect, useState } from 'react'
import { WeatherCards } from '../components/weatherCards/weatherCards'
import styles from './page.module.css'
import { getWeather } from './actions'
import { CoordinatesType } from '../geolocation/geolocation'
import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
    WeatherMetadata,
} from '@/lib/interfaces'
import { WeatherReport } from '@/app/components/weatherReport/weatherReport'
import { DayNightColorLayer } from '../components/background/dayNightColorLayer'
import { MoonIcon, SunIcon } from '../components/icons'
import { Background } from '../components/background/background'

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [weatherMetadata, setWeatherMetadata] = useState<WeatherMetadata>()
    const [currentWeather, setCurrentWeather] =
        useState<CurrentWeatherDataType>()
    const [weatherForecast, setWeatherForecast] = useState<
        DailyWeatherForecastType[]
    >(Array(8).fill({}))

    //get user coordinates from search params
    const coords: CoordinatesType = {
        latitude: searchParams.lat ? Number(searchParams.lat) : 404,
        longitude: searchParams.lon ? Number(searchParams.lon) : 404,
    }
    if (coords.latitude == 404 || coords.longitude == 404) {
        throw new Error('No coordinates found')
    } else console.log(coords)

    //use server action to fetch weather data from API
    if (!weatherMetadata) {
        getWeather(coords)
            .then((response) => {
                return JSON.parse(response)
            })
            .then((value) => {
                setWeatherMetadata(value.metadata)
                setCurrentWeather(value.current)
                setWeatherForecast(value.daily)
            })
    }

    return (
        <div className={styles.weatherPage}>
            {currentWeather ? (
                <WeatherReport currentWeather={currentWeather} />
            ) : (
                <>Loading</>
            )}
            <WeatherCards weatherForecast={weatherForecast} />
            <Background
                timeObject={{
                    currentTime: currentWeather?.time.split('T')[1],
                    sunrise: currentWeather?.sunrise.split('T')[1],
                    sunset: currentWeather?.sunset.split('T')[1],
                }}
            />
        </div>
    )
}

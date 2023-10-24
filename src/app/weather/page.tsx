'use client'
import { useEffect, useState } from 'react'
import WeatherCards from '../components/weatherCards/weatherCards'
import styles from './page.module.css'
import { getWeather } from './actions'
import { CoordinatesType } from '../geolocation/geolocation'
import {
    CurrentWeatherDataType,
    DailyWeatherCardType,
    WeatherMetadata,
} from '@/lib/interfaces'
import { WeatherReport } from '@/app/components/weatherReport/weatherReport'
import { DayNightColorLayer } from '../components/dayNightColorLayer'

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
    const [weatherForecast, setWeatherForecast] =
        useState<DailyWeatherCardType[]>()
    const [userWeather, setUserWeather] = useState<any>()

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
                console.log('response from getWeather')
                console.log(response)
                return JSON.parse(response)
            })
            .then((value) => {
                console.log('value from getWeather')
                console.log(value)
                setWeatherMetadata(value.metadata)
                setCurrentWeather(value.current)
                setWeatherForecast(value.daily)
            })
    } else {
        console.log('user weather already set')
        console.log(weatherMetadata)
    }

    return (
        <div className={styles.weatherPage}>
            {currentWeather ? (
                <WeatherReport currentWeather={currentWeather} />
            ) : (
                <>Loading</>
            )}
            <WeatherCards getWeather={getWeather} />
            {currentWeather ? (
                <DayNightColorLayer
                    time={currentWeather.time.split('T')[1]}
                    sunrise={currentWeather.sunrise.split('T')[1]}
                    sunset={currentWeather.sunset.split('T')[1]}
                />
            ) : (
                <></>
            )}
        </div>
    )
}

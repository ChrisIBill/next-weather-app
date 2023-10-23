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

const WeatherAPISrc = `FarTestWeatherData.json`

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
    if (!userWeather) {
        getWeather(coords)
            .then((value) => {
                setWeatherMetadata(value.metadata)
                setCurrentWeather(value.current)
                setWeatherForecast(value.daily)
            })
            .then(() => {
                console.log(weatherMetadata)
                console.log(currentWeather)
                console.log(weatherForecast)
            })
    } else {
        console.log('user weather already set')
        console.log(userWeather)
    }

    return (
        <div className={styles.weatherPage}>
            <WeatherCards getWeather={getWeather} />
        </div>
    )
}

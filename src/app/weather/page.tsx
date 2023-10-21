'use client'
import { useEffect, useState } from 'react'
import WeatherCards from '../components/weatherCards/weatherCards'
import styles from './page.module.css'
import { getWeather } from './actions'
import { CoordinatesType } from '../geolocation/geolocation'

const WeatherAPISrc = `FarTestWeatherData.json`

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
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
            .then((value) => setUserWeather(value))
            .then(() => console.log(userWeather))
    } else {
        console.log('user weather already set')
        console.log(userWeather)
    }

    return (
        <div className={styles.weatherPage}>
            <WeatherCards />
        </div>
    )
}

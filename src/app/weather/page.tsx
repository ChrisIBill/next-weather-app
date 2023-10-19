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

    const coords: CoordinatesType = {
        latitude: searchParams.lat ? Number(searchParams.lat) : 0,
        longitude: searchParams.lon ? Number(searchParams.lon) : 0,
    }
    console.log(coords)

    if (userWeather) {
        console.log(userWeather)
        console.log('user weather is set')
    } else {
        console.log('user weather is not set')
    }

    useEffect(() => {
        let ignore = false
        getWeather(coords).then((value) => setUserWeather(value))
        if (userWeather) {
            console.log(userWeather)
            ignore = true
        } else {
            console.log('user weather is not set')
        }
    }, [userWeather, coords])

    //    const weatherData = handleWeatherData(coords)
    //        .then((value) => {
    //            console.log(value)
    //            console.log('setting user weather')
    //        })
    //        .then((value) => value)
    //    if (weatherData) {
    //        console.log(weatherData)
    //        console.log('user weather is set')
    //    } else {
    //        console.log('user weather is not set')
    //    }

    return (
        <div className={styles.weatherPage}>
            <WeatherCards />
            <h1>My Page</h1>
            <h2>params: {params.slug}</h2>
            <h2>searchParams: {JSON.stringify(searchParams)}</h2>
        </div>
    )
}

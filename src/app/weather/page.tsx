'use client'
import { useEffect, useState } from 'react'
import { WeatherCards } from '../components/weatherCards/weatherCards'
import styles from './page.module.css'
import { getWeather } from './actions'
import { CoordinatesType } from '../geolocation/geolocation'
import {
    CurrentWeatherDataType,
    DailyWeatherForecastType,
    LocationType,
    WeatherMetadata,
    WeatherReportDataType,
} from '@/lib/interfaces'
import { WeatherReport } from '@/app/components/weatherReport/weatherReport'
import { DayNightColorLayer } from '../components/background/dayNightColorLayer'
import { MoonIcon, SunIcon } from '../components/icons'
import { Background } from '../components/background/background'
import UserPrefs from '@/lib/user'
import { WeatherPageHeader } from './header'

function handleWeatherSearch(searchParams: {
    [key: string]: string | string[] | undefined
}): LocationType {
    if (searchParams.address)
        return { address: searchParams.address.toString() }
    else if (
        searchParams.lat &&
        searchParams.lon &&
        typeof searchParams.lat == 'string' &&
        typeof searchParams.lon == 'string'
    )
        return {
            latitude: parseFloat(searchParams.lat),
            longitude: parseFloat(searchParams.lon),
        }
    else throw new Error('Invalid search parameters')
}

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const User = new UserPrefs()
    const [weatherMetadata, setWeatherMetadata] = useState<WeatherMetadata>()
    const [currentWeather, setCurrentWeather] =
        useState<CurrentWeatherDataType>()
    const [weatherForecast, setWeatherForecast] = useState<
        DailyWeatherForecastType[]
    >(Array(8).fill({}))
    const [weatherReportData, setWeatherReportData] =
        useState<WeatherReportDataType>()

    //get user coordinates from search params
    const location = handleWeatherSearch(searchParams)

    //use server action to fetch weather data from API
    if (!weatherMetadata) {
        getWeather(location, User.getUserPreferences())
            .then((response) => {
                return JSON.parse(response)
            })
            .then((value) => {
                setWeatherMetadata(value.metadata)
                setCurrentWeather(value.current)
                setWeatherForecast(value.daily)
                setWeatherReportData(value.current)
            })
    }

    const handleCardSelect = (card: DailyWeatherForecastType) => {
        setWeatherReportData(card as WeatherReportDataType)
    }

    const handleWeatherReportChange = (
        weatherReportData: WeatherReportDataType
    ) => {
        setWeatherReportData(weatherReportData)
    }

    return (
        <div className={styles.weatherPage}>
            <WeatherPageHeader time={weatherReportData?.time} />
            {currentWeather ? (
                <WeatherReport currentWeather={currentWeather} />
            ) : (
                <>Loading</>
            )}
            <WeatherCards
                weatherForecast={weatherForecast}
                handleCardSelect={handleCardSelect}
            />
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

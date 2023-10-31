'use client'
import { useEffect, useState } from 'react'
import { WeatherCards } from '../components/weatherCards/weatherCards'
import styles from './page.module.css'
import { getWeather } from './actions'
import { CoordinatesType } from '../geolocation/geolocation'
import {
    CurrentWeatherDataType,
    DailyWeatherDataType,
    DailyWeatherForecastType,
    DetailedWeatherDataType,
    HourlyWeatherDataType,
    LocationType,
    WeatherForecastType,
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
    //const [currentWeather, setCurrentWeather] =
    //    useState<CurrentWeatherDataType>()
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecastType>(
        Array(8).fill({})
    )
    const [weatherReportData, setWeatherReportData] =
        useState<DetailedWeatherDataType>()
    const [selectedWeatherData, setSelectedWeatherData] =
        useState<DetailedWeatherDataType>()
    const [selectedHour, setSelectedHour] = useState<number>(0)
    const [selectedDay, setSelectedDay] = useState<number>(0)

    const test: CurrentWeatherDataType | HourlyWeatherDataType = {}
    //get user coordinates from search params
    const location = handleWeatherSearch(searchParams)

    //use server action to fetch weather data from API
    if (!weatherMetadata) {
        getWeather(location, User.getUserPreferences())
            .then((response) => {
                return JSON.parse(response)
            })
            .then((value) => {
                console.log(value)
                setWeatherMetadata(value.metadata)
                //setCurrentWeather(value.current)
                setWeatherForecast(value.forecast)
                setWeatherReportData(
                    value.forecast[0].current
                        ? value.forecast[0].current
                        : value.forecast[0]
                )
            })
    }

    const handleCardSelect = (card: DailyWeatherDataType) => {
        setWeatherReportData(card)
    }

    const handleWeatherReportChange = (
        weatherReportData: DetailedWeatherDataType
    ) => {
        setWeatherReportData(weatherReportData)
    }
    return (
        <div className={styles.weatherPage}>
            <WeatherPageHeader
                time={
                    weatherReportData?.time
                        ? weatherReportData.time
                        : weatherReportData?.date
                }
            />
            {weatherReportData ? (
                <WeatherReport weatherForecast={weatherReportData} />
            ) : (
                <>Loading</>
            )}
            <WeatherCards
                weatherForecast={weatherForecast}
                handleCardSelect={handleCardSelect}
            />
            <Background
                timeObject={{
                    currentTime: weatherReportData?.time?.split('T')[1],
                    sunrise: weatherReportData?.sunrise?.split('T')[1],
                    sunset: weatherReportData?.sunset?.split('T')[1],
                }}
            />
        </div>
    )
}

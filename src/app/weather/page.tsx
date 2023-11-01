'use client'
import { useEffect, useState } from 'react'
import { WeatherCards } from '../components/weatherCards/weatherCards'
import styles from './page.module.css'
import { getWeather } from './actions'
import {
    DetailedWeatherDataType,
    LocationType,
    WeatherForecastType,
    WeatherMetadata,
} from '@/lib/interfaces'
import { WeatherReport } from '@/app/components/weatherReport/weatherReport'
import { Background } from '../components/background/background'
import UserPrefs from '@/lib/user'
import { WeatherPageHeader } from './header'
import { DailyWeatherReport } from '../components/weatherReports/dailyWeatherReport'
import { HourlyWeatherReport } from '../components/weatherReports/hourlyWeatherReport'

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
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecastType>(
        Array(8).fill({})
    )
    const [weatherReportData, setWeatherReportData] =
        useState<DetailedWeatherDataType>()
    const [selectedHour, setSelectedHour] = useState<number | undefined>(-1)
    const [selectedDay, setSelectedDay] = useState<number>(0)

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
                setWeatherForecast(value.forecast)
                setWeatherReportData(
                    value.forecast[0].current_weather
                        ? value.forecast[0].current_weather
                        : value.forecast[0]
                )
            })
    }

    const handleTimeSelect = (day: number, hour?: number) => {
        if (day > weatherForecast.length || day < 0)
            throw new Error('Invalid day selection')
        setSelectedDay(day)
        if (hour) {
            if (hour > 23 || hour < -1)
                throw new Error('Invalid hour selection')
            if (hour == -1 && day != 0)
                throw new Error('Invalid hour selection')
            setSelectedHour(hour)
        } else setSelectedHour(undefined)
    }
    const getSelectedForecast = () => {
        if (!selectedHour) {
            return weatherForecast[selectedDay]
        } else if (selectedHour == -1) return weatherForecast[0].current_weather
        else {
            if (!weatherForecast[selectedDay]?.hourly_weather)
                throw new Error('No hourly weather data for this day')
            return weatherForecast[selectedDay].hourly_weather![selectedHour]
        }
    }
    const getSelectedForecastDay = () => {
        return weatherForecast[selectedDay]
    }
    return (
        <div className={styles.weatherPage}>
            <div className={styles.contentWrapper}>
                <WeatherPageHeader time={getSelectedForecast()?.time} />
                {/*<div className={styles.reportsWrapper}>
                    <DailyWeatherReport forecast={getSelectedForecastDay()} />
                    <HourlyWeatherReport forecast={getSelectedForecastDay()} />
                </div>*/}
                <WeatherCards
                    weatherForecast={weatherForecast}
                    handleCardSelect={handleTimeSelect}
                    selectedDay={selectedHour == -1 ? undefined : selectedDay}
                />
            </div>
            <Background weatherForecast={getSelectedForecast()} />
        </div>
    )
}

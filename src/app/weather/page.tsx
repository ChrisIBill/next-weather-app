'use client'
import React, { useEffect, useState } from 'react'
import { WeatherCards } from '../components/weatherCards/weatherCards'
import styles from './page.module.scss'
import { getWeather } from './actions'
import {
    DailyWeatherForecastObjectType,
    LocationType,
    WeatherForecastType,
    WeatherMetadata,
} from '@/lib/interfaces'
import { Background } from '../components/background/background'
import UserPrefs, { UserPreferencesInterface } from '@/lib/user'
import { WeatherPageHeader } from './header'
import { CurrentWeatherReport } from '../components/weatherReports/dailyWeatherReport'
import { HourlyWeatherReport } from '../components/weatherReports/hourlyWeatherReport'
import { getTimeObj } from '@/lib/time'
import { useUser } from '@/lib/context'
import { WeatherChart } from '../components/weatherCharts/weatherChart'
import PrecipitationClass from '@/lib/obj/precipitation'
import { useWindowDimensions } from '@/lib/hooks'

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

function handleWeatherForecast(
    forecast: WeatherForecastType,
    metadata: WeatherMetadata,
    user: () => UserPreferencesInterface
) {
    return forecast.map((day) => {
        return {
            timeObj: getTimeObj(day),
            precipitation: new PrecipitationClass(
                day.precipitation_probability_max!,
                day.precipitation_sum!,
                day.snowfall_sum!,
                () => user().precipitationUnit!
            ),
            cloud_cover: day.cloud_cover!,
            hourly_weather: day.hourly_weather?.map((hour) => {
                return {
                    timeObj: getTimeObj(hour),
                    precipitation: new PrecipitationClass(
                        hour.precipitation_probability!,
                        hour.precipitation!,
                        hour.snowfall!,
                        () => user().precipitationUnit!
                    ),
                    cloud_cover: hour.cloud_cover!,
                }
            }),
            current_weather: day.current_weather
                ? {
                      timeObj: getTimeObj(day.current_weather),
                      precipitation: new PrecipitationClass(
                          100,
                          day.current_weather.precipitation!,
                          day.current_weather!.snowfall!,
                          () => user().precipitationUnit!
                      ),
                      cloud_cover: day.current_weather!.cloud_cover!,
                  }
                : undefined,
        }
    })
}

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [weatherMetadata, setWeatherMetadata] = useState<WeatherMetadata>()
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecastType>(
        Array(8).fill(undefined)
    )
    const [forecastObj, setForecastObj] = useState<
        DailyWeatherForecastObjectType[]
    >(Array(8).fill(undefined))
    const [reload, setReload] = useState<boolean>(false)
    const [selectedHour, setSelectedHour] = useState<number | undefined>(-1)
    const [selectedDay, setSelectedDay] = useState<number>(0)

    const User = useUser().user
    //get user coordinates from search params
    const location = handleWeatherSearch(searchParams)

    const chartWrapperRef = React.useRef<HTMLDivElement>(null)

    //Handles users time selection, which controls which weather data is displayed in detail
    const handleTimeSelect = (day?: number, hour?: number) => {
        if (day) {
            if (day > weatherForecast.length || day < 0)
                throw new Error('Invalid day selection')
            setSelectedDay(day)
        }
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
        } else if (selectedHour == -1)
            return weatherForecast[0]?.current_weather
        else {
            if (!weatherForecast[selectedDay]?.hourly_weather)
                throw new Error('No hourly weather data for this day')
            return weatherForecast[selectedDay].hourly_weather![selectedHour]
        }
    }
    const getSelectedForecastObj = () => {
        if (!selectedHour) {
            return forecastObj[selectedDay]
        } else if (selectedHour == -1) return forecastObj[0]?.current_weather
        else {
            if (!forecastObj[selectedDay]?.hourly_weather)
                throw new Error('No hourly weather data for this day')
            return forecastObj[selectedDay].hourly_weather![selectedHour]
        }
    }

    const getSelectedForecastDay = () => {
        return weatherForecast[selectedDay]
    }

    const timeObj = getTimeObj(getSelectedForecast())

    const fetchWeather = () => {
        getWeather(location, User)
            .then((response) => {
                return JSON.parse(response)
            })
            .then((value) => {
                console.log(value)
                setWeatherMetadata(value.metadata)
                setWeatherForecast(value.forecast)
                setForecastObj(
                    handleWeatherForecast(
                        value.forecast,
                        value.metadata,
                        () => User
                    )
                )
                console.log(forecastObj)
            })
    }
    if (!weatherMetadata || User.reload) {
        console.log('Fetching weather from server')
        fetchWeather()
        User.reload = false
    }

    return (
        <div className={styles.weatherPage}>
            <div className={styles.contentWrapper}>
                <div className={styles.landingPage}>
                    <div className={styles.readoutWrapper} style={{}}>
                        <CurrentWeatherReport
                            forecast={getSelectedForecast()}
                            metadata={weatherMetadata}
                            timeObj={timeObj}
                        />
                        <WeatherPageHeader timeObj={timeObj} />
                        <div className={styles.spacerElement} />
                    </div>
                    <div className={styles.chartWrapper} ref={chartWrapperRef}>
                        {chartWrapperRef.current !== null ? (
                            <WeatherChart
                                forecast={weatherForecast}
                                metadata={weatherMetadata}
                                selectedDay={selectedDay}
                                handleChartSelect={handleTimeSelect}
                                timeObj={timeObj}
                                parentRef={chartWrapperRef}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className={styles.cardsWrapper}>
                        <WeatherCards
                            weatherForecast={weatherForecast}
                            forecastObj={forecastObj}
                            metadata={weatherMetadata?.units.daily}
                            handleCardSelect={handleTimeSelect}
                            selectedDay={
                                selectedHour == -1 ? undefined : selectedDay
                            }
                        />
                    </div>
                </div>

                <div className={styles.reportsPage}>
                    <HourlyWeatherReport
                        forecast={getSelectedForecastDay()}
                        metadata={weatherMetadata}
                        handleTimeSelect={handleTimeSelect}
                    />
                </div>
            </div>
            {getSelectedForecastObj() ? (
                <Background
                    weatherForecast={getSelectedForecast()}
                    forecastObj={getSelectedForecastObj()}
                    timeObj={timeObj}
                />
            ) : (
                <></>
            )}
            <div className={styles.gradientLayer} />
        </div>
    )
}

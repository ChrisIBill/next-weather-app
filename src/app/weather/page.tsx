'use client'
import React, { useEffect, useRef, useState } from 'react'
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
import { HourlyWeatherReport } from '../components/weatherReports/hourlyWeatherReport'
import { WeatherChart } from '../components/weatherCharts/weatherChart'
import PrecipitationClass from '@/lib/obj/precipitation'
import { useWindowDimensions } from '@/lib/hooks'
import DayTimeClass from '@/lib/obj/time'
import { SelectedForecastReadout } from '../components/weatherReports/selectedForecastReadout'
import { DayTemperatureClass } from '@/lib/obj/temperature'
import WindClass from '@/lib/obj/wind'
import { CloudClass } from '@/lib/obj/cloudClass'
import {
    CurrentForecastStateHandler,
    useForecastSetStore,
} from '@/lib/obj/forecastStore'
import Scrollbars from 'react-custom-scrollbars-2'

import { Container, styled, useTheme } from '@mui/material'
import { ScrollButton } from '../components/scrollButton'
import { useSearchParams } from 'next/navigation'

function handleWeatherSearch(searchParams: {
    [key: string]: string | string[] | null
}): LocationType {
    console.log('Search Params: ', searchParams)
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
    metadata: WeatherMetadata
): DailyWeatherForecastObjectType[] {
    return forecast.map((day) => {
        if (!day.time2)
            throw new Error('Malformed forecast data, no time field')
        const timeObj = new DayTimeClass(day.time2, day.sunrise2, day.sunset2)
        const tempObj = new DayTemperatureClass(
            [day.temperature_2m_max, day.temperature_2m_min],
            [day.apparent_temperature_max, day.apparent_temperature_min]
        )

        return {
            timeObj: timeObj,
            precipitationObj: new PrecipitationClass(
                day.precipitation_sum!,
                day.snowfall_sum!,
                day.precipitation_probability_max!
            ),
            temperatureObj: tempObj,
            windObj: new WindClass(
                [day.windspeed_10m_max, day.windgusts_10m_max],
                day.winddirection_10m_dominant
            ),
            cloudObj: new CloudClass(
                day.avg_cloudcover ?? 0,
                day.weathercode ?? 0
            ),
            hourly_weather: day.hourly_weather?.map((hour, index) => {
                return {
                    timeObj: timeObj.hours[index],
                    precipitationObj: new PrecipitationClass(
                        hour.precipitation!,
                        hour.snowfall!,
                        hour.precipitation_probability!
                    ),
                    temperatureObj: tempObj.getSetHour(
                        hour.temperature_2m,
                        hour.apparent_temperature
                    ),
                    windObj: new WindClass(
                        [hour.windspeed_10m, hour.windgusts_10m],
                        hour.winddirection_10m
                    ),
                    cloudObj: new CloudClass(
                        hour.cloudcover ?? 0,
                        hour.weathercode ?? 0
                    ),
                }
            }),
            current_weather: day.current_weather
                ? {
                      timeObj: timeObj.createCurrent(
                          day.current_weather.time2!
                      ),
                      precipitationObj: new PrecipitationClass(
                          day.current_weather.precipitation!,
                          day.current_weather!.snowfall!,
                          day.current_weather.precipitation ? 100 : 0
                      ),
                      temperatureObj: tempObj.getSetCurrent(
                          day.current_weather.temperature_2m,
                          day.current_weather.apparent_temperature
                      ),
                      windObj: new WindClass(
                          [
                              day.current_weather.windspeed_10m,
                              day.current_weather.windgusts_10m,
                          ],
                          day.current_weather.winddirection_10m
                      ),
                      cloudObj: new CloudClass(
                          day.current_weather.cloudcover ?? 0,
                          day.current_weather.weathercode ?? 0
                      ),
                  }
                : undefined,
        }
    })
}

const ChartWrapper = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        //width: '75%',
    },
}))

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const searchParams2 = useSearchParams()

    const scrollRef = useRef<HTMLDivElement>(null)
    const [weatherMetadata, setWeatherMetadata] = useState<WeatherMetadata>()
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecastType>(
        Array(8).fill(undefined)
    )
    //const isFirstRender = useRef<boolean>(true)
    const [forecastObj, setForecastObj] = useState<
        DailyWeatherForecastObjectType[]
    >(Array(8).fill(undefined))
    const theme = useTheme()

    console.log('Reloading Weather Page: ', params, searchParams)

    const chartWrapperRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        console.log('useEffect: searchParams', searchParams)
        console.log('useEffect: searchParams2', searchParams2)
        const [lat, lon, address] = [
            searchParams2.get('lat'),
            searchParams2.get('lon'),
            searchParams2.get('address'),
        ]
        const location = address
            ? handleWeatherSearch({ address })
            : handleWeatherSearch({ lat, lon })
        getWeather(location)
            .then((response) => {
                return JSON.parse(response)
            })
            .then((value) => {
                console.log('Server Forecast Response: ', value)
                setWeatherMetadata(value.metadata)
                setWeatherForecast(value.forecast)
                setForecastObj(
                    handleWeatherForecast(value.forecast, value.metadata)
                )
            })
    }, [searchParams, searchParams2])

    const { width, height } = useWindowDimensions() ?? {
        width: 0,
        height: 0,
    }
    return (
        <div
            ref={scrollRef}
            className={styles.weatherPageWrapper}
            data-theme={theme.palette.mode}
        >
            <CurrentForecastStateHandler forecastObj={forecastObj} />
            <div className={styles.weatherPage}>
                <div className={styles.contentWrapper}>
                    <div className={styles.landingPage}>
                        <SelectedForecastReadout forecastObj={forecastObj} />
                        <ChartWrapper
                            className={styles.chartWrapper}
                            ref={chartWrapperRef}
                            style={{
                                width: '100%',
                                height: 'auto',
                                aspectRatio: '2/1',
                                alignSelf: 'center',
                            }}
                        >
                            {chartWrapperRef.current !== null ? (
                                <WeatherChart
                                    forecastObj={forecastObj}
                                    parentRef={chartWrapperRef}
                                />
                            ) : (
                                <div></div>
                            )}
                        </ChartWrapper>
                        <WeatherCards forecastObj={forecastObj} />
                    </div>

                    <div className={styles.reportsPage}>
                        <HourlyWeatherReport forecastObj={forecastObj} />
                    </div>
                </div>
                <Background />
                <GradientLayer />
            </div>
            <ScrollButton scrollRef={scrollRef} />
        </div>
    )
}

const GradientLayer: React.FC = () => {
    const [mounted, setMounted] = useState<boolean>(false)
    const theme = useTheme()
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null
    return (
        <div
            className={styles.gradientLayer}
            style={{
                backgroundImage: `linear-gradient(180deg, ${
                    theme.palette.mode === 'dark'
                        ? 'rgba(0,0,0,1)'
                        : 'rgba(255,255,255,0.5)'
                } 0%, rgba(255,255,255,0) 30%)`,
            }}
        />
    )
}

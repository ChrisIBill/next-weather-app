'use client'
import React, { useEffect, useRef, useState } from 'react'
import { WeatherCards } from '../components/weatherCards/weatherCards'
import styles from './page.module.scss'
import { getWeather } from './actions'
import {
    FullForecastObjectType,
    LocationType,
    WeatherForecastType,
} from '@/lib/interfaces'
import { WeatherChart } from '../components/weatherCharts/weatherChart'
import PrecipitationClass from '@/lib/obj/precipitation'
import { useWindowDimensions } from '@/lib/hooks'
import DayTimeClass from '@/lib/obj/time'
import { SelectedForecastReadout } from '../components/weatherReports/selectedForecastReadout'
import { DayTemperatureClass } from '@/lib/obj/temperature'
import WindClass from '@/lib/obj/wind'
import { CloudClass } from '@/lib/obj/cloudClass'
import { styled, useTheme } from '@mui/material'
import { ScrollButton } from '../components/scrollButton'
import { usePathname, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { HourlyWeatherReportProps } from '../components/weatherReports/hourlyWeatherReport'
import { LocationInterface, handleLocation } from '@/lib/location'
import logger from '@/lib/pinoLogger'
import { CurrentForecastStateHandler } from '../components/stateHandlers'

const weatherPageLogger = logger.child({ module: 'Weather Page' })

const HourlyWeatherReport = dynamic<HourlyWeatherReportProps>(
    () =>
        import('../components/weatherReports/hourlyWeatherReport').then(
            (mod) => mod.HourlyWeatherReport
        ),
    { ssr: false }
)

function handleWeatherSearch(searchParams: {
    [key: string]: string | string[] | null
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
    location: LocationInterface
): FullForecastObjectType {
    const forecastObj = forecast.map((day) => {
        if (!day.time) throw new Error('Invalid forecast data')
        const timeObj = new DayTimeClass(day.time, day.sunrise, day.sunset)
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
                      timeObj: timeObj.createCurrent(day.current_weather.time!),
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
    const metadata = {
        location: handleLocation(location),
    }
    return { forecast: forecastObj, metadata }
}

const ChartWrapper = styled('div')(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.only('lg')]: {
        width: '75%',
    },
    [theme.breakpoints.down('lg')]: {
        width: '90%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}))

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    weatherPageLogger.debug('rendering weather page')
    const searchParams2 = useSearchParams()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    weatherPageLogger.info('Timezone: ', timezone)

    const scrollRef = useRef<HTMLDivElement>(null)
    const [location, setLocation] = useState<any>([])
    //const isFirstRender = useRef<boolean>(true)
    const [forecastObj, setForecastObj] = useState<FullForecastObjectType>({
        forecast: Array(8).fill(undefined),
        metadata: {},
    })

    const chartWrapperRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const [lat, lon, address] = [
            searchParams2.get('lat'),
            searchParams2.get('lon'),
            searchParams2.get('address'),
        ]
        weatherPageLogger.debug('Search Parameters for weather page: ', {
            lat,
            lon,
            address,
        })
        const location = address
            ? handleWeatherSearch({ address })
            : handleWeatherSearch({ lat, lon })
        getWeather(location, timezone)
            .then((response) => {
                return JSON.parse(response)
            })
            .then((value) => {
                weatherPageLogger.info('Server Forecast Response: ', value)
                setLocation(handleLocation(value.address))
                setForecastObj(
                    handleWeatherForecast(value.forecast, value.address)
                )
            })
    }, [searchParams, searchParams2])

    const { width, height } = useWindowDimensions() ?? {
        width: 0,
        height: 0,
    }
    return (
        <React.Fragment>
            <CurrentForecastStateHandler forecastObj={forecastObj} />
            <div className={styles.contentWrapper}>
                <div className={styles.landingPage}>
                    <SelectedForecastReadout
                        forecastObj={forecastObj.forecast}
                    />
                    <ChartWrapper
                        className={styles.chartWrapper}
                        ref={chartWrapperRef}
                        style={{
                            height: 'auto',
                            aspectRatio: '16/9',
                            alignSelf: 'center',
                        }}
                    >
                        {chartWrapperRef.current !== null ? (
                            <WeatherChart
                                forecastObj={forecastObj.forecast}
                                parentRef={chartWrapperRef}
                            />
                        ) : (
                            <div></div>
                        )}
                    </ChartWrapper>
                    <WeatherCards forecastObj={forecastObj.forecast} />
                </div>

                <div className={styles.reportsPage}>
                    <HourlyWeatherReport forecastObj={forecastObj.forecast} />
                </div>
            </div>
            <GradientLayer />
            <ScrollButton scrollRef={scrollRef} />
        </React.Fragment>
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

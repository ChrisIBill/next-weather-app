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
import { HourlyWeatherReport } from '../components/weatherReports/hourlyWeatherReport'
import { getTimeObj } from '@/lib/time'
import { WeatherChart } from '../components/weatherCharts/weatherChart'
import PrecipitationClass from '@/lib/obj/precipitation'
import { useWindowDimensions } from '@/lib/hooks'
import DayTimeClass from '@/lib/obj/time'
import { SelectedForecastReadout } from '../components/weatherReports/selectedForecastReadout'
import { DayTemperatureClass } from '@/lib/obj/temperature'
import WindClass from '@/lib/obj/wind'
import { CloudClass } from '@/lib/obj/cloudClass'
import { useForecastObjStore } from '@/lib/stores'

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
                day.precipitation_probability_max!,
                day.precipitation_sum!,
                day.snowfall_sum!
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
                        hour.precipitation_probability!,
                        hour.precipitation!,
                        hour.snowfall!
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
                          day.current_weather.precipitation ? 100 : 0,
                          day.current_weather.precipitation!,
                          day.current_weather!.snowfall!
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

export function useForecastSetStore() {
    const setForecastStore = useForecastObjStore((state) => ({
        setTimePercent: state.timePercent.setState,
        setIsDay: state.isDay.setState,
        setTimeOfDay: state.timeOfDay.setState,
        setRainMagnitude: state.rainMagnitude.setState,
        setSnowMagnitude: state.snowMagnitude.setState,
        setWindMagnitude: state.windMagnitude.setState,
        setTemperatureMagnitude: state.temperatureMagnitude.setState,
        setCloudMagnitude: state.cloudMagnitude.setState,
        setCloudLightness: state.cloudLightness.setState,
    }))
    return setForecastStore
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
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
    const [forecastObj, setForecastObj] = useState<
        DailyWeatherForecastObjectType[]
    >(Array(8).fill(undefined))
    const [selectedHour, setSelectedHour] = useState<number | undefined>(-1)
    const [selectedDay, setSelectedDay] = useState<number>(0)

    const chartWrapperRef = React.useRef<HTMLDivElement>(null)

    const setForecastStore = useForecastSetStore()

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

    const getSelectedForecastDayObj = () => {
        return forecastObj[selectedDay]
    }

    useEffect(() => {
        const location = handleWeatherSearch(searchParams)
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
    }, [searchParams])

    useEffect(() => {
        const handleInitialWeather = () => {
            try {
                setForecastStore.setCloudMagnitude(
                    forecastObj[0].cloudObj.cloudCover
                )
                setForecastStore.setCloudLightness(
                    forecastObj[0].cloudObj.getCloudLightness()
                )
            } catch (error) {
                console.log(error)
            }
            try {
                const { getTimePercent, getIsDay, getTimeOfDay } =
                    forecastObj[0].current_weather!.timeObj
                setForecastStore.setTimePercent(getTimePercent!())
                setForecastStore.setIsDay(getIsDay!())
                setForecastStore.setTimeOfDay(getTimeOfDay!())
            } catch (error) {
                console.log(error)
            }
            try {
                setForecastStore.setRainMagnitude(
                    forecastObj[0].current_weather!.precipitationObj.getMagnitude()
                )
                setForecastStore.setWindMagnitude(
                    forecastObj[0].current_weather!.windObj._kph[0]
                )
                setForecastStore.setTemperatureMagnitude(
                    forecastObj[0].current_weather!.temperatureObj.getAvgTemp()
                )
            } catch (error) {
                console.log(error)
            }
        }
        if (forecastObj[0] !== undefined && isFirstRender) {
            setIsFirstRender(false)
            handleInitialWeather()
        }
    }, [forecastObj, setForecastStore, isFirstRender])

    const { width, height } = useWindowDimensions() ?? { width: 0, height: 0 }
    return (
        <div
            className={styles.weatherPageWrapper}
            style={{
                width: '100vw',
                height: '100vh',
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}
        >
            <div className={styles.weatherPage}>
                <div className={styles.contentWrapper}>
                    <div className={styles.landingPage}>
                        <SelectedForecastReadout
                            forecastObj={getSelectedForecastObj()}
                        />
                        <div
                            className={styles.chartWrapper}
                            ref={chartWrapperRef}
                        >
                            {chartWrapperRef.current !== null ? (
                                <WeatherChart
                                    forecast={weatherForecast}
                                    metadata={weatherMetadata}
                                    selectedDay={selectedDay}
                                    handleChartSelect={handleTimeSelect}
                                    forecastObj={forecastObj}
                                    parentRef={chartWrapperRef}
                                />
                            ) : (
                                <div></div>
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
                            //forecast={getSelectedForecastDay()}
                            forecastObj={
                                getSelectedForecastDayObj()?.hourly_weather ??
                                []
                            }
                            metadata={weatherMetadata}
                            handleTimeSelect={handleTimeSelect}
                        />
                    </div>
                </div>
                <Background forecastObj={getSelectedForecastObj()} />
                <div className={styles.gradientLayer} />
            </div>
        </div>
    )
}

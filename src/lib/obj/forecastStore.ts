import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { TimeOfDayType } from './time'
import { setToRange } from '../lib'
import {
    DailyWeatherForecastObjectType,
    ForecastObjectType,
    FullForecastObjectType,
    HourlyForecastObjectType,
} from '../interfaces'
import { PaletteMode, useTheme } from '@mui/material'
import { useEffect, useRef } from 'react'
import { log } from 'next-axiom'
import { LocationInterface } from '../location'

export type TimeStateType = 'current' | [number, number | undefined]

export const enum ForecastStateKeysEnum {
    time = 'time',
    timePercent = 'timePercent',
    isDay = 'isDay',
    timeOfDay = 'timeOfDay',
    rainMagnitude = 'rainMagnitude',
    snowMagnitude = 'snowMagnitude',
    windMagnitude = 'windMagnitude',
    temperatureMagnitude = 'temperatureMagnitude',
    cloudMagnitude = 'cloudMagnitude',
    cloudLightness = 'cloudLightness',
}
export type ForecastStateKeysType = keyof typeof ForecastStateKeysEnum
export interface ForecastObjectStateType {
    location: {
        state: LocationInterface | undefined
        setState: (location: LocationInterface) => void
    }
    time: {
        state: TimeStateType //[day, hour]
        setState: (arg0: TimeStateType) => void
        setHourState: (hour: number) => void
    }
    timePercent: {
        state: number
        setState: (timePercent: number) => void
    }
    isDay: {
        state: boolean
        setState: (isDay: boolean) => void
    }
    timeOfDay: {
        state: TimeOfDayType
        setState: (timeOfDay: TimeOfDayType) => void
    }
    rainMagnitude: {
        state: number
        setState: (rainMagnitude: number) => void
    }
    snowMagnitude: {
        state: number
        setState: (snowMagnitude: number) => void
    }
    windMagnitude: {
        state: number
        setState: (windSpeed: number) => void
    }
    temperatureMagnitude: {
        state: number
        setState: (temperature: number) => void
    }
    cloudMagnitude: {
        state: number
        setState: (cloudCover: number) => void
    }
    cloudLightness: {
        state: number
        setState: (cloudLightness: number) => void
    }
}
export const useForecastObjStore = create<ForecastObjectStateType>(
    (set, get) => ({
        location: {
            state: undefined,
            setState: (location: LocationInterface) => {
                set((state) => ({
                    ...state,
                    location: {
                        ...state.location,
                        state: location,
                    },
                }))
            },
        },
        time: {
            state: [0, 12], //[ day, hour ]
            setState: (time: TimeStateType = 'current') => {
                set((state) => ({
                    ...state,
                    time: {
                        ...state.time,
                        state:
                            time === 'current'
                                ? 'current'
                                : [
                                      setToRange(time[0], 0, 7),
                                      time[1]
                                          ? setToRange(time[1], 0, 23)
                                          : undefined,
                                  ],
                    },
                }))
            },
            setHourState: (hour: number) => {
                set((state) => ({
                    ...state,
                    time: {
                        ...state.time,
                        state:
                            state.time.state === 'current'
                                ? [0, hour]
                                : [state.time.state[0], hour],
                    },
                }))
            },
        },
        timePercent: {
            state: 0.66,
            setState: (timePercent?: number) => {
                set((state) => {
                    if (state.timePercent.state === timePercent) return state
                    return {
                        ...state,
                        timePercent: {
                            ...state.timePercent,
                            state: timePercent
                                ? setToRange(timePercent, 0, 100)
                                : 0.5,
                        },
                    }
                })
            },
        },
        isDay: {
            state: true,
            setState: (isDay: boolean) => {
                set((state) => {
                    if (state.isDay.state === isDay) return state
                    return {
                        ...state,
                        isDay: {
                            ...state.isDay,
                            state: isDay,
                        },
                    }
                })
            },
        },
        timeOfDay: {
            state: 'day',
            setState: (timeOfDay: TimeOfDayType) => {
                set((state) => {
                    if (state.timeOfDay.state === timeOfDay) return state
                    return {
                        ...state,
                        timeOfDay: {
                            ...state.timeOfDay,
                            state: timeOfDay,
                        },
                    }
                })
            },
        },
        rainMagnitude: {
            state: 0,
            setState: (rainMagnitude: number) => {
                set((state) => {
                    if (state.rainMagnitude.state === rainMagnitude)
                        return state
                    return {
                        ...state,
                        rainMagnitude: {
                            ...state.rainMagnitude,
                            state: setToRange(rainMagnitude, 0, 5),
                        },
                    }
                })
            },
        },
        snowMagnitude: {
            state: 0,
            setState: (snowMagnitude: number) => {
                set((state) => {
                    if (state.snowMagnitude.state === snowMagnitude)
                        return state
                    return {
                        ...state,
                        snowMagnitude: {
                            ...state.snowMagnitude,
                            state: setToRange(snowMagnitude, 0, 5),
                        },
                    }
                })
            },
        },
        windMagnitude: {
            state: 0,
            setState: (windSpeed: number) => {
                set((state) => {
                    if (state.windMagnitude.state === windSpeed) return state
                    return {
                        ...state,
                        windMagnitude: {
                            ...state.windMagnitude,
                            state: setToRange(windSpeed, 0, 12),
                        },
                    }
                })
            },
        },
        cloudMagnitude: {
            state: 10,
            setState: (cloudMagnitude: number) => {
                set((state) => {
                    if (state.cloudMagnitude.state === cloudMagnitude)
                        return state
                    return {
                        ...state,
                        cloudMagnitude: {
                            ...state.cloudMagnitude,
                            state: setToRange(cloudMagnitude, 0, 100),
                        },
                    }
                })
            },
        },
        cloudLightness: {
            state: 99,
            setState: (cloudLightness: number) => {
                set((state) => {
                    if (state.cloudLightness.state === cloudLightness)
                        return state
                    return {
                        ...state,
                        cloudLightness: {
                            ...state.cloudLightness,
                            state: setToRange(cloudLightness, 30, 99),
                        },
                    }
                })
            },
        },
        temperatureMagnitude: {
            state: 0,
            setState: (temperature: number) => {
                set((state) => {
                    if (state.temperatureMagnitude.state === temperature)
                        return state
                    const newState = setToRange(temperature, -10, 10)
                    return {
                        ...state,
                        temperatureMagnitude: {
                            ...state.temperatureMagnitude,
                            state: newState,
                        },
                    }
                })
            },
        },
    })
)

export function useForecastSetStore() {
    const setForecastStore = useForecastObjStore(
        useShallow((state) => ({
            setLocation: state.location.setState,
            setTime: state.time.setState,
            setHour: state.time.setHourState,
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
    )
    return setForecastStore
}
export function useSelectedForecastTime(
    forecastObj?: DailyWeatherForecastObjectType[]
): ForecastObjectType | undefined {
    const selectedTime =
        useForecastObjStore((state) => state.time.state) ?? 'current'
    try {
        if (!forecastObj || !forecastObj[0]) return undefined
        if (selectedTime === 'current') return forecastObj[0].current_weather!
        else if (selectedTime[1])
            return forecastObj[selectedTime[0]].hourly_weather[selectedTime[1]]
        else return forecastObj[selectedTime[0]]
    } catch (e) {
        console.error(
            'Error in useSelectedForecastTime handling time: ',
            selectedTime
        )
        throw e
    }
}

export function useSelectedForecastDay(
    forecastObj?: DailyWeatherForecastObjectType[]
): DailyWeatherForecastObjectType | undefined {
    const selectedDay = useForecastObjStore((state) => state.time.state[0])
    log.debug('Use selected forecast day: ', { selectedDay })
    try {
        if (!forecastObj || !forecastObj[0]) return undefined
        if (typeof selectedDay === 'string') return forecastObj[0]
        return forecastObj[selectedDay]
    } catch (e) {
        console.error(
            'Error in useSelectedForecastDay handling day: ',
            selectedDay
        )
        throw e
    }
}

export function useSetForecastDay(
    dayIndex: number,
    day: DailyWeatherForecastObjectType
) {
    const palette = useTheme().palette
    const setForecastStore = useForecastSetStore()
    try {
        setForecastStore.setTime([dayIndex, undefined])
        setForecastStore.setTimePercent(0.5)
        setForecastStore.setIsDay(palette.mode === 'light' ? true : false)
        setForecastStore.setTimeOfDay(
            palette.mode === 'light' ? 'day' : 'night'
        )
        setForecastStore.setRainMagnitude(day.precipitationObj.getMagnitude())
        //setForecastStore.setSnowMagnitude(day.precipitationObj.getSnowMagnitude?.())
        setForecastStore.setWindMagnitude(day.windObj._beaufort()[0])
        setForecastStore.setCloudMagnitude(day.cloudObj.cloudCover)
        setForecastStore.setCloudLightness(day.cloudObj.getCloudLightness())
        setForecastStore.setTemperatureMagnitude(
            day.temperatureObj.getMagnitude()
        )
    } catch (e) {
        log.error('Error in useSetForecastDay setting day: ', { dayIndex })
    }
}

export function setForecastDay(
    dayIndex: number,
    day: DailyWeatherForecastObjectType,
    setForecastStore: any,
    mode: PaletteMode
) {
    log.debug('setForecastDay: ', { dayIndex, day, mode })
    try {
        setForecastStore.setTime([dayIndex, undefined])
        setForecastStore.setTimePercent()
        setForecastStore.setIsDay(mode === 'light' ? true : false)
        setForecastStore.setTimeOfDay(mode === 'light' ? 'day' : 'night')
        setForecastStore.setRainMagnitude(day.precipitationObj.getMagnitude())
        //setForecastStore.setSnowMagnitude(day.precipitationObj.getSnowMagnitude?.())
        setForecastStore.setWindMagnitude(day.windObj._beaufort()[0])
        setForecastStore.setCloudMagnitude(day.cloudObj.cloudCover)
        setForecastStore.setCloudLightness(day.cloudObj.getCloudLightness())
        setForecastStore.setTemperatureMagnitude(
            day.temperatureObj.getMagnitude()
        )
    } catch (e) {
        log.error('Error in SetForecastDay setting day: ', {
            dayIndex,
            day,
            mode,
        })
        console.error(
            'Error in SetForecastDay setting day: ',
            dayIndex,
            ' with props: ',
            day,
            mode,
            setForecastStore
        )
    }
}

export function setForecastHour(
    hourIndex: number,
    hour: HourlyForecastObjectType,
    setForecastStore: any
) {
    //const setForecastStore = useForecastSetStore()
    try {
        setForecastStore.setTime([0, hourIndex])
        setForecastStore.setTimePercent(hour.timeObj.getTimePercent())
        setForecastStore.setIsDay(hour.timeObj.getIsDay())
        setForecastStore.setTimeOfDay(hour.timeObj.getTimeOfDay())
        setForecastStore.setRainMagnitude(hour.precipitationObj.getMagnitude())
        //setForecastStore.setSnowMagnitude(hour.precipitationObj.getSnowMagnitude?.())
        setForecastStore.setWindMagnitude(hour.windObj._beaufort()[0])
        setForecastStore.setCloudMagnitude(hour.cloudObj.cloudCover)
        setForecastStore.setCloudLightness(hour.cloudObj.getCloudLightness())
        setForecastStore.setTemperatureMagnitude(
            hour.temperatureObj.getMagnitude()
        )
    } catch (e) {
        console.error('Error in useSetForecastHour setting hour: ', hourIndex)
    }
}

export interface CurrentForecastStateHandlerProps {
    forecastObj?: FullForecastObjectType
}

export const CurrentForecastStateHandler: React.FC<
    CurrentForecastStateHandlerProps
> = (props: CurrentForecastStateHandlerProps) => {
    const setForecastStore = useForecastSetStore()
    const isFirstRender = useRef<boolean>(true)

    useEffect(() => {
        const forecastObj = props.forecastObj?.forecast
        const metadata = props.forecastObj?.metadata
        const handleInitialWeather = () => {
            try {
                setForecastStore.setLocation(metadata!.location!)
                setForecastStore.setTime('current')
                setForecastStore.setCloudMagnitude(
                    forecastObj![0].cloudObj.cloudCover
                )
                setForecastStore.setCloudLightness(
                    forecastObj![0].cloudObj.getCloudLightness()
                )
            } catch (error) {
                console.log(error)
            }
            try {
                const { getTimePercent, getIsDay, getTimeOfDay } =
                    forecastObj![0].current_weather!.timeObj
                setForecastStore.setTimePercent(getTimePercent!())
                setForecastStore.setIsDay(getIsDay!())
                setForecastStore.setTimeOfDay(getTimeOfDay!())
            } catch (error) {
                console.log(error)
            }
            try {
                setForecastStore.setRainMagnitude(
                    forecastObj![0].current_weather!.precipitationObj.getMagnitude()
                )
                setForecastStore.setWindMagnitude(
                    forecastObj![0].current_weather!.windObj._beaufort()[0]
                )
                setForecastStore.setTemperatureMagnitude(
                    forecastObj![0].current_weather!.temperatureObj.getMagnitude()
                )
            } catch (error) {
                console.log(error)
            }
        }
        if (forecastObj && forecastObj[0] && isFirstRender.current) {
            isFirstRender.current = false
            handleInitialWeather()
        } else {
            console.log('No forecast object', forecastObj)
        }
    }, [props.forecastObj, setForecastStore])

    return null
}

export interface DailyForecastStateHandlerProps {
    forecastObj?: DailyWeatherForecastObjectType[]
}

export interface HourlyForecastStateHandlerProps {
    forecastObj?: HourlyForecastObjectType[]
    dayIndex: number
}

// export const HourlyForecastStateHandler: React.FC<
//     HourlyForecastStateHandlerProps
// > = (props: HourlyForecastStateHandlerProps) => {
//     const setForecastStore = useForecastSetStore()
//     const isFirstRender = useRef<boolean>(true)
//     const forecastObj = props.forecastObj
//
//     useEffect(() => {
//         const handleHourlyWeather = setForecastHour(
//             props.dayIndex,
//             forecastObj![props.dayIndex],
//             setForecastStore
//         )
//         if (forecastObj && forecastObj[0] && isFirstRender.current) {
//             isFirstRender.current = false
//             //handleInitialWeather()
//         } else {
//             log.debug('No forecast object', forecastObj)
//         }
//     }, [forecastObj, setForecastStore, props.dayIndex])
//
//     return null
// }

import { create } from 'zustand'
import PrecipitationClass, {
    PrecipitationClassType,
    PrecipitationUnitStringsType,
} from './obj/precipitation'
import {
    DayTemperatureClass,
    DayTemperatureClassType,
    HourTemperatureClass,
    HourTemperatureClassType,
    TemperatureUnitStringsType,
} from './obj/temperature'
import WindClass, {
    WIND_UNIT_STRINGS,
    WindClassType,
    WindUnitStringsType,
} from './obj/wind'
import { setToRange } from './lib'
import { TimeOfDayType } from './obj/time'
import DayTimeClass, { DayTimeClassType, HourTimeClassType } from './obj/time'
import { CloudClass, CloudClassType, hslType } from './obj/cloudClass'
import { hsl } from './lib'

export const USER_PREFERENCES_KEYS = [
    'animationLevel',
    'temperatureUnit',
    'windUnit',
    'precipitationUnit',
] as const
export type UserPreferencesKeysType = (typeof USER_PREFERENCES_KEYS)[number]
export interface UserPreferencesInterface {
    animationLevel: number
    temperatureUnit: TemperatureUnitStringsType
    windUnit: WindUnitStringsType
    precipitationUnit: PrecipitationUnitStringsType
}
export const DEFAULT_USER_PREFS: UserPreferencesInterface = {
    animationLevel: 3,
    temperatureUnit: '°F',
    windUnit: 'mph',
    precipitationUnit: 'inch',
}
export const enum AnimationLevelsEnum {
    None,
    Low,
    Medium,
    High,
}
export const ANIMATION_LEVELS = [
    AnimationLevelsEnum.None,
    AnimationLevelsEnum.Low,
    AnimationLevelsEnum.Medium,
    AnimationLevelsEnum.High,
] as const
export const ANIMATION_PREF_STRINGS = ['None', 'Low', 'Medium', 'High'] as const
export const TEMPERATURE_UNIT_STRINGS = ['°F', '°C'] as const
export const PRECIPIATION_UNIT_STRINGS = ['inch', 'mm'] as const

export const USER_PREFS_STRINGS = {
    temperatureStrings: TEMPERATURE_UNIT_STRINGS,
    windStrings: WIND_UNIT_STRINGS,
    precipitationStrings: PRECIPIATION_UNIT_STRINGS,
} as const
export type UserPrefsStringsType =
    | (typeof ANIMATION_PREF_STRINGS)[number]
    | (typeof TEMPERATURE_UNIT_STRINGS)[number]
    | (typeof WIND_UNIT_STRINGS)[number]
    | (typeof PRECIPIATION_UNIT_STRINGS)[number]
export function getFromLocalStorage(key: string) {
    try {
        //TODO: this catches if ran on server, but dont think this should be running on server in first place
        if (typeof window === 'undefined') return undefined
        return localStorage.getItem(key)
    } catch (err) {
        console.error(err)
        return undefined
    }
    return localStorage.getItem(key)
}
export function setToLocalStorage(key: string, value: string) {
    try {
        if (typeof window === 'undefined') return
        localStorage.setItem(key, value)
    } catch (err) {
        console.error(err)
        throw new Error('Error setting to local storage')
    }
}

function setInitialUserPref<T>(localKey: string, keys: ReadonlyArray<T>) {
    const pref = getFromLocalStorage(localKey)
    if (pref && keys.includes(pref as any)) {
        console.log(
            "Found local user's preference for " + localKey + ': ' + pref
        )
        return pref as T
    } else if (pref) {
        console.error(
            "User's preference: " + pref + ' for ' + keys + ' invalid'
        )
    }
}
const temperatureUnitStringGenerator = function* (
    s: TemperatureUnitStringsType
) {
    let i = 0
    if (TEMPERATURE_UNIT_STRINGS.includes(s))
        i = TEMPERATURE_UNIT_STRINGS.indexOf(s)
    while (true) {
        yield TEMPERATURE_UNIT_STRINGS[i]
        i = (i + 1) % TEMPERATURE_UNIT_STRINGS.length
    }
}

const getInitialUserPrefs = () => {
    const animationLevel = parseInt(
        getFromLocalStorage('animationLevel') ?? '3'
    )
    const temperatureUnit =
        setInitialUserPref('temperatureUnit', TEMPERATURE_UNIT_STRINGS) || '°C'
    const windUnit =
        setInitialUserPref('windSpeedUnit', WIND_UNIT_STRINGS) || 'kph'
    const precipitationUnit =
        setInitialUserPref('precipitationUnit', PRECIPIATION_UNIT_STRINGS) ||
        'mm'
    return {
        animationLevel,
        temperatureUnit,
        windUnit,
        precipitationUnit,
    }
    return DEFAULT_USER_PREFS
}

export interface UserPrefsState extends UserPreferencesInterface {
    nextAnimationLevel: () => void
    nextTempUnit: () => void
    nextWindUnit: () => void
    nextPrecipitationUnit: () => void
}
export const useUserPrefsStore = create<UserPrefsState>()((set, get) => ({
    ...getInitialUserPrefs(),
    nextAnimationLevel: () => {
        set((state) => {
            const nextUnit = (state.animationLevel + 1) % 4
            setToLocalStorage('animationLevel', nextUnit)
            return {
                animationLevel: nextUnit,
            }
        })
    },

    nextTempUnit: () => {
        set((state) => {
            const nextUnit =
                TEMPERATURE_UNIT_STRINGS[
                    (TEMPERATURE_UNIT_STRINGS.indexOf(state.temperatureUnit) +
                        1) %
                        TEMPERATURE_UNIT_STRINGS.length
                ]
            setToLocalStorage('temperatureUnit', nextUnit)
            return {
                temperatureUnit: nextUnit,
            }
        })
    },
    nextWindUnit: () =>
        set((state) => {
            const nextUnit =
                WIND_UNIT_STRINGS[
                    (WIND_UNIT_STRINGS.indexOf(state.windUnit) + 1) %
                        WIND_UNIT_STRINGS.length
                ]
            setToLocalStorage('windSpeedUnit', nextUnit)
            return {
                windUnit: nextUnit,
            }
        }),
    nextPrecipitationUnit: () =>
        set((state) => {
            const nextUnit =
                PRECIPIATION_UNIT_STRINGS[
                    (PRECIPIATION_UNIT_STRINGS.indexOf(
                        state.precipitationUnit
                    ) +
                        1) %
                        PRECIPIATION_UNIT_STRINGS.length
                ]
            setToLocalStorage('precipitationUnit', nextUnit)
            return {
                precipitationUnit: nextUnit,
            }
        }),
}))

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
    //timeObj: HourTimeClassType | DayTimeClassType
    //temperatureObj: HourTemperatureClassType | DayTemperatureClassType
    //precipitationObj: PrecipitationClassType
    //windObj: WindClassType
    time: {
        state: TimeStateType //[day, hour]
        setState: (time: 'current' | [number, number]) => void
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
    [key: ForecastStateKeysType]: {
        state: number | TimeOfDayType | TimeStateType | boolean
        setState: (
            value: number | TimeOfDayType | TimeStateType | boolean
        ) => void
    }
}
export const useForecastObjStore = create<ForecastObjectStateType>(
    (set, get) => ({
        time: {
            state: [0, 12], //[ day, hour ]
            setState: (
                time: 'current' | [number, number | undefined] = 'current'
            ) => {
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
        },
        timePercent: {
            state: 0.66,
            setState: (timePercent: number) => {
                set((state) => ({
                    ...state,
                    timePercent: {
                        ...state.timePercent,
                        state: setToRange(timePercent, 0, 100),
                    },
                }))
            },
        },
        isDay: {
            state: true,
            setState: (isDay: boolean) => {
                set((state) => ({
                    ...state,
                    isDay: {
                        ...state.isDay,
                        state: isDay,
                    },
                }))
            },
        },
        timeOfDay: {
            state: 'day',
            setState: (timeOfDay: TimeOfDayType) => {
                set((state) => ({
                    ...state,
                    timeOfDay: {
                        ...state.timeOfDay,
                        state: timeOfDay,
                    },
                }))
            },
        },
        rainMagnitude: {
            state: 0,
            setState: (rainMagnitude: number) => {
                set((state) => ({
                    ...state,
                    rainMagnitude: {
                        ...state.rainMagnitude,
                        state: setToRange(rainMagnitude, 0, 5),
                    },
                }))
            },
        },
        snowMagnitude: {
            state: 0,
            setState: (snowMagnitude: number) => {
                set((state) => ({
                    ...state,
                    snowMagnitude: {
                        ...state.snowMagnitude,
                        state: setToRange(snowMagnitude, 0, 5),
                    },
                }))
            },
        },
        windMagnitude: {
            state: 0,
            setState: (windSpeed: number) => {
                set((state) => ({
                    ...state,
                    windSpeed: {
                        ...state.windSpeed,
                        state: setToRange(windSpeed, 0, 100),
                    },
                }))
            },
        },
        cloudMagnitude: {
            state: 10,
            setState: (cloudMagnitude: number) => {
                set((state) => {
                    console.log('Setting cloud cover to ' + cloudMagnitude)
                    if (state.cloudMagnitude === cloudMagnitude) {
                        console.log(
                            'Cloud cover already set to ' + cloudMagnitude
                        )
                        return state
                    }
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
                    console.log('Setting cloud lightness to ' + cloudLightness)
                    if (state.cloudLightness === cloudLightness) {
                        console.log(
                            'Cloud lightness already set to ' + cloudLightness
                        )
                        return state
                    }
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
            state: 20,
            setState: (temperature: number) => {
                set((state) => {
                    if (state.temperature === temperature) {
                        return state
                    }
                    return {
                        ...state,
                        temperature: {
                            ...state.temperature,
                            state: setToRange(temperature, -40, 50),
                        },
                    }
                })
            },
        },
    })
)

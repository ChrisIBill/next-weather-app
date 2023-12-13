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
import { TimeOfDayType } from './time'
import DayTimeClass, { DayTimeClassType, HourTimeClassType } from './obj/time'
import { CloudClass, CloudClassType, hslType } from './obj/cloudClass'
import { hsl } from './lib'

export interface UserPreferencesInterface {
    temperatureUnit: TemperatureUnitStringsType
    windUnit: WindUnitStringsType
    precipitationUnit: PrecipitationUnitStringsType
}
export const DEFAULT_USER_PREFS: UserPreferencesInterface = {
    temperatureUnit: '°F',
    windUnit: 'mph',
    precipitationUnit: 'inch',
}
export const TEMPERATURE_UNIT_STRINGS = ['°F', '°C'] as const
export const PRECIPIATION_UNIT_STRINGS = ['inch', 'mm'] as const

export const USER_PREFS_STRINGS = {
    temperatureStrings: TEMPERATURE_UNIT_STRINGS,
    windStrings: WIND_UNIT_STRINGS,
    precipitationStrings: PRECIPIATION_UNIT_STRINGS,
} as const
export type UserPrefsStringsType =
    | (typeof TEMPERATURE_UNIT_STRINGS)[number]
    | (typeof WIND_UNIT_STRINGS)[number]
    | (typeof PRECIPIATION_UNIT_STRINGS)[number]
export function getFromLocalStorage(key: string) {
    try {
        return localStorage.getItem(key)
    } catch (err) {
        console.error('Couldnt get from local storage, context: ', this)
        console.error(err)
        return undefined
    }
    return localStorage.getItem(key)
}
export function setToLocalStorage(key: string, value: string) {
    try {
        setToLocalStorage(key, value)
    } catch (err) {
        console.log(err)
        throw new Error('Error setting to local storage')
    }
}

function setInitialUserPref<T>(localKey: string, keys: ReadonlyArray<T>) {
    const pref = getFromLocalStorage(localKey)
    console.log('initial pref from local: ', pref)
    if (pref && keys.includes(pref as any)) {
        console.log('pref is valid')
        return pref as T
    } else return undefined
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
    const temperatureUnit =
        setInitialUserPref('tempUnit', TEMPERATURE_UNIT_STRINGS) || '°C'
    const windUnit =
        setInitialUserPref('windSpeedUnit', WIND_UNIT_STRINGS) || 'kph'
    const precipitationUnit =
        setInitialUserPref('precipitationUnit', PRECIPIATION_UNIT_STRINGS) ||
        'mm'
    if (temperatureUnit && windUnit && precipitationUnit) {
        return {
            temperatureUnit,
            windUnit,
            precipitationUnit,
        }
    }
    return DEFAULT_USER_PREFS
}

export interface UserPrefsState extends UserPreferencesInterface {
    nextTempUnit: () => void
    nextWindUnit: () => void
    nextPrecipitationUnit: () => void
}
export const useUserPrefsStore = create<UserPrefsState>()((set, get) => ({
    ...getInitialUserPrefs(),
    nextTempUnit: () =>
        set((state) => ({
            temperatureUnit:
                TEMPERATURE_UNIT_STRINGS[
                    (TEMPERATURE_UNIT_STRINGS.indexOf(state.temperatureUnit) +
                        1) %
                        TEMPERATURE_UNIT_STRINGS.length
                ],
        })),
    nextWindUnit: () =>
        set((state) => ({
            windUnit:
                WIND_UNIT_STRINGS[
                    (WIND_UNIT_STRINGS.indexOf(state.windUnit) + 1) %
                        WIND_UNIT_STRINGS.length
                ],
        })),
    nextPrecipitationUnit: () =>
        set((state) => ({
            precipitationUnit:
                PRECIPIATION_UNIT_STRINGS[
                    (PRECIPIATION_UNIT_STRINGS.indexOf(
                        state.precipitationUnit
                    ) +
                        1) %
                        PRECIPIATION_UNIT_STRINGS.length
                ],
        })),
}))

export interface ForecastObjectStateType {
    //timeObj: HourTimeClassType | DayTimeClassType
    //temperatureObj: HourTemperatureClassType | DayTemperatureClassType
    //precipitationObj: PrecipitationClassType
    //windObj: WindClassType
    cloudCover: {
        state: number
        setState: (cloudCover: number) => void
    }
    cloudLightness: {
        state: number
        setState: (cloudLightness: number) => void
    }
    [key: string]: {
        state: number
        setState: (value: number) => void
    }
}
export const useForecastObjStore = create<ForecastObjectStateType>(
    (set, get) => ({
        time: {
            state: 12,
            setState: (time: number) => {
                set((state) => ({
                    ...state,
                    time: {
                        ...state.time,
                        state: setToRange(time, 0, 23),
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
        windSpeed: {
            state: 0,
            setState: (windSpeed: number) => {
                set((state) => ({
                    ...state,
                    windSpeed: {
                        ...state.cloudCover,
                        state: setToRange(windSpeed, 0, 100),
                    },
                }))
            },
        },
        cloudCover: {
            state: 10,
            setState: (cloudCover: number) => {
                set((state) => ({
                    ...state,
                    cloudCover: {
                        ...state.cloudCover,
                        state: setToRange(cloudCover, 0, 100),
                    },
                }))
            },
        },
        cloudLightness: {
            state: 99,
            setState: (cloudLightness: number) => {
                set((state) => ({
                    ...state,
                    cloudLightness: {
                        ...state.cloudLightness,
                        state: setToRange(cloudLightness, 30, 99),
                    },
                }))
            },
        },
        temperature: {
            state: 20,
            setState: (temperature: number) => {
                set((state) => ({
                    ...state,
                    temperature: {
                        ...state.temperature,
                        state: setToRange(temperature, -40, 50),
                    },
                }))
            },
        },
    })
)

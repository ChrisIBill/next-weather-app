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
            setToLocalStorage(
                'animationLevel',
                ANIMATION_PREF_STRINGS[nextUnit]
            )
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

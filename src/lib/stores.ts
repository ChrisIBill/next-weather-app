import { create } from 'zustand'
import {
    PRECIPIATION_UNIT_STRINGS,
    PrecipitationUnitStringsType,
} from './obj/precipitation'
import {
    TEMPERATURE_UNIT_STRINGS,
    TemperatureUnitStringsType,
} from './obj/temperature'
import { WIND_UNIT_STRINGS, WindUnitStringsType } from './obj/wind'

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
    if (!localStorage || localStorage.getItem(key) === null) return
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
function getNextTempUnit(str: TemperatureUnitStringsType) {
    console.log('initiating string literal generator: ', str)
    const generator = temperatureUnitStringGenerator(str)
    const val = generator.next().value
    return generator
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
export const test = () => {
    const arrayTest = ['a', 'b', 'c', 'd', 'e'] as const
    const elem = arrayTest.values()
    elem.next().value
}

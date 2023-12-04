import dayjs from 'dayjs'
import { PrecipitationUnitStrings } from './obj/precipitation'

export const enum TemperatureEnum {
    fahrenheit = 'fahrenheit',
    celsius = 'celsius',
}
export const TemperatureUnits = [
    TemperatureEnum.fahrenheit,
    TemperatureEnum.celsius,
] as const
const WindSpeedUnits = ['mph', 'kph', 'ms', 'kn'] as const
const PrecipitationUnits = ['inch', 'mm'] as const

const OVERRIDE_THEME_TYPES = ['light', 'dark'] as const
export const ThemeTypes = ['light', 'dark'] as const
// exporting constants array of string literals to allow for iteration and type-checking
export const ContextUnits = {
    TemperatureUnits,
    WindSpeedUnits,
    PrecipitationUnits,
    ThemeTypes,
}

export type TemperatureUnitType = (typeof TemperatureUnits)[number]
export type WindSpeedUnitType = (typeof WindSpeedUnits)[number]
export type ThemeLiteralsType = (typeof ThemeTypes)[number]

export function themeTypeValidator(theme: string): theme is ThemeLiteralsType {
    return ThemeTypes.includes(theme as ThemeLiteralsType)
}

export interface UserPreferencesInterface {
    tempUnit?: TemperatureUnitType
    windSpeedUnit?: WindSpeedUnitType
    precipitationUnit?: PrecipitationUnitStrings
    reload?: boolean
    themePrefs: ThemeLiteralsType
}
export const DEFAULT_USER_PREFS: UserPreferencesInterface = {
    tempUnit: TemperatureEnum.fahrenheit,
    windSpeedUnit: 'mph',
    precipitationUnit: 'inch',
    themePrefs: 'light',
}

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
export default class UserPrefs implements UserPreferencesInterface {
    tempUnit?: TemperatureUnitType
    windSpeedUnit?: WindSpeedUnitType
    precipitationUnit?: PrecipitationUnitStrings
    themePrefs: ThemeLiteralsType

    constructor() {
        this.tempUnit = this.getLocalTempUnit()
        this.windSpeedUnit = this.getLocalWindSpeedUnit()
        this.precipitationUnit = this.getLocalPrecipitationUnit()
        this.themePrefs = this.getLocalThemePrefs()
    }

    //Type-Guards
    public isTemperatureUnit(unit: any): unit is TemperatureUnitType {
        return TemperatureUnits.includes(unit as TemperatureUnitType)
    }
    public isWindSpeedUnit(unit: any): unit is WindSpeedUnitType {
        return WindSpeedUnits.includes(unit as WindSpeedUnitType)
    }
    public isPrecipitationUnit(unit: any): unit is PrecipitationUnitStrings {
        return PrecipitationUnits.includes(unit as PrecipitationUnitStrings)
    }
    public isThemeType(unit: any): unit is ThemeLiteralsType {
        return ThemeTypes.includes(unit as ThemeLiteralsType)
    }
    public isUserPreferences(
        userPrefs: UserPreferencesInterface
    ): userPrefs is UserPreferencesInterface {
        //TODO: Testing
        if (userPrefs instanceof UserPrefs) return true
        else if (
            this.isTemperatureUnit(userPrefs.tempUnit) &&
            this.isWindSpeedUnit(userPrefs.windSpeedUnit) &&
            this.isPrecipitationUnit(userPrefs.precipitationUnit) &&
            this.isThemeType(userPrefs.themePrefs)
        )
            return true
        else return false
    }

    //Getters
    // prettier-ignore
    public getTempUnit() { return this.tempUnit }
    // prettier-ignore
    public getWindSpeedUnit() { return this.windSpeedUnit }
    // prettier-ignore
    public getPrecipitationUnit() { return this.precipitationUnit }
    public getThemePrefs() {
        if (this.themePrefs && ['light', 'dark'].includes(this.themePrefs))
            return this.themePrefs
        return undefined
    }

    private getLocalTempUnit() {
        const unit = getFromLocalStorage('tempUnit')
        if (unit && this.isTemperatureUnit(unit)) return unit
        else return undefined
    }
    private getLocalWindSpeedUnit() {
        const unit = getFromLocalStorage('windSpeedUnit')
        if (unit && this.isWindSpeedUnit(unit)) return unit
        else return undefined
    }
    private getLocalPrecipitationUnit() {
        const unit = getFromLocalStorage('precipitationUnit')
        if (unit && this.isPrecipitationUnit(unit)) return unit
        else return undefined
    }
    private getLocalThemePrefs() {
        let unit = getFromLocalStorage('themePrefs') || 'light'
        if (unit && this.isThemeType(unit)) return unit
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            unit = 'dark'
            localStorage.setItem('themePrefs', unit)
        }
        return unit as ThemeLiteralsType
    }

    public getUserPreferences(): UserPreferencesInterface {
        return {
            tempUnit: this.tempUnit,
            windSpeedUnit: this.windSpeedUnit,
            precipitationUnit: this.precipitationUnit,
            themePrefs: this.themePrefs,
        }
    }

    //Setters
    public setTempUnit(unit: TemperatureUnitType) {
        if (this.isTemperatureUnit(unit)) {
            this.tempUnit = unit
            localStorage.setItem('tempUnit', unit)
        } else throw new Error('Invalid Temperature Unit')
    }
    public setWindSpeedUnit(unit: WindSpeedUnitType) {
        if (this.isWindSpeedUnit(unit)) {
            this.windSpeedUnit = unit
            localStorage.setItem('windSpeedUnit', unit)
        } else throw new Error('Invalid Wind Speed Unit')
    }
    public setPrecipitationUnit(unit: PrecipitationUnitStrings) {
        if (this.isPrecipitationUnit(unit)) {
            this.precipitationUnit = unit
            localStorage.setItem('precipitationUnit', unit)
        } else throw new Error('Invalid Precipitation Unit')
    }
}

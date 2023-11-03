import dayjs from 'dayjs'

const TemperatureUnits = ['Fahrenheit', 'Celsius'] as const
const WindSpeedUnits = ['Mph', 'Kph', 'm/s', 'Knots'] as const
const PrecipitationUnits = ['in', 'mm'] as const
const OVERRIDE_THEME_TYPES = ['basic', 'light', 'dark', ''] as const
const THEME_TYPES = [
    '',
    'basic',
    'light',
    'dark',
    'hour00',
    'hour01',
    'hour02',
    'hour03',
    'hour04',
    'hour05',
    'hour06',
    'hour07',
    'hour08',
    'hour09',
    'hour10',
    'hour11',
    'hour12',
    'hour13',
    'hour14',
    'hour15',
    'hour16',
    'hour17',
    'hour18',
    'hour19',
    'hour20',
    'hour21',
    'hour22',
    'hour23',
] as const
// exporting constants array of string literals to allow for iteration and type-checking
export const MeasurementUnits = {
    TemperatureUnits,
    WindSpeedUnits,
    PrecipitationUnits,
}

export type TemperatureUnitType = (typeof TemperatureUnits)[number]
export type WindSpeedUnitType = (typeof WindSpeedUnits)[number]
export type PrecipitationUnitType = (typeof PrecipitationUnits)[number]
export type ThemeType = (typeof THEME_TYPES)[number]

export function themeTypeValidator(theme: string): theme is ThemeType {
    return THEME_TYPES.includes(theme as ThemeType)
}

export interface UserPreferencesInterface {
    tempUnit?: TemperatureUnitType
    windSpeedUnit?: WindSpeedUnitType
    precipitationUnit?: PrecipitationUnitType
    themePrefs?: ThemeType
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
    precipitationUnit?: PrecipitationUnitType
    themePrefs?: ThemeType

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
    public isPrecipitationUnit(unit: any): unit is PrecipitationUnitType {
        return PrecipitationUnits.includes(unit as PrecipitationUnitType)
    }
    public isThemeType(unit: any): unit is ThemeType {
        return THEME_TYPES.includes(unit as ThemeType)
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
        if (
            this.themePrefs &&
            ['basic', 'light', 'dark'].includes(this.themePrefs)
        )
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
        const unit = getFromLocalStorage('themePrefs')
        if (unit && this.isThemeType(unit)) return unit
        return undefined
    }

    public getUserPreferences(): UserPreferencesInterface {
        return {
            tempUnit: this.tempUnit,
            windSpeedUnit: this.windSpeedUnit,
            precipitationUnit: this.precipitationUnit,
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
    public setPrecipitationUnit(unit: PrecipitationUnitType) {
        if (this.isPrecipitationUnit(unit)) {
            this.precipitationUnit = unit
            localStorage.setItem('precipitationUnit', unit)
        } else throw new Error('Invalid Precipitation Unit')
    }
}

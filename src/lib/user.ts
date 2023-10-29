const TemperatureUnits = ['Fahrenheit', 'Celsius'] as const
const WindSpeedUnits = ['Mph', 'Kph', 'm/s', 'Knots'] as const
const PrecipitationUnits = ['in', 'mm'] as const
// exporting constants array of string literals to allow for iteration and type-checking
export const MeasurementUnits = {
    TemperatureUnits,
    WindSpeedUnits,
    PrecipitationUnits,
}

export type TemperatureUnitType = (typeof TemperatureUnits)[number]
export type WindSpeedUnitType = (typeof WindSpeedUnits)[number]
export type PrecipitationUnitType = (typeof PrecipitationUnits)[number]

export interface UserPreferencesInterface {
    tempUnit?: TemperatureUnitType
    windSpeedUnit?: WindSpeedUnitType
    precipitationUnit?: PrecipitationUnitType
}

export function getFromLocalStorage(key: string) {
    if (!localStorage || localStorage.getItem(key) === null) return
    return localStorage.getItem(key)
}
export default class UserPrefs implements UserPreferencesInterface {
    tempUnit?: TemperatureUnitType
    windSpeedUnit?: WindSpeedUnitType
    precipitationUnit?: PrecipitationUnitType

    constructor() {
        this.tempUnit = this.getLocalTempUnit()
        this.windSpeedUnit = this.getLocalWindSpeedUnit()
        this.precipitationUnit = this.getLocalPrecipitationUnit()
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
    public isUserPreferences(
        userPrefs: UserPreferencesInterface
    ): userPrefs is UserPreferencesInterface {
        //TODO: Testing
        if (userPrefs instanceof UserPrefs) return true
        else if (
            this.isTemperatureUnit(userPrefs.tempUnit) &&
            this.isWindSpeedUnit(userPrefs.windSpeedUnit) &&
            this.isPrecipitationUnit(userPrefs.precipitationUnit)
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

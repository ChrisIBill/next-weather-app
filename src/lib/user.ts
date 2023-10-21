const TemperatureUnits = ['Fahrenheit', 'Celsius', 'Kelvin'] as const
const WindSpeedUnits = ['Mph', 'Kph', 'Mps'] as const
const PrecipitationUnits = ['in', 'mm', 'cm'] as const
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

export default class UserPrefs implements UserPreferencesInterface {
    tempUnit?: TemperatureUnitType
    windSpeedUnit?: WindSpeedUnitType
    precipitationUnit?: PrecipitationUnitType

    constructor(userPrefs?: UserPreferencesInterface) {
        this.tempUnit = userPrefs?.tempUnit ? userPrefs.tempUnit : undefined
        this.windSpeedUnit = userPrefs?.windSpeedUnit
            ? userPrefs.windSpeedUnit
            : undefined
        this.precipitationUnit = userPrefs?.precipitationUnit
            ? userPrefs.precipitationUnit
            : undefined
    }

    //Type-Guards
    public isTemperatureUnit(unit: string): unit is TemperatureUnitType {
        return TemperatureUnits.includes(unit as TemperatureUnitType)
    }
    public isWindSpeedUnit(unit: string): unit is WindSpeedUnitType {
        return WindSpeedUnits.includes(unit as WindSpeedUnitType)
    }
    public isPrecipitationUnit(unit: string): unit is PrecipitationUnitType {
        return PrecipitationUnits.includes(unit as PrecipitationUnitType)
    }
    public isUserPreferences(
        userPrefs: UserPreferencesInterface
    ): userPrefs is UserPreferencesInterface {
        //TODO: Testing
        if (userPrefs instanceof UserPrefs) return true
        else return false
    }

    //Getters
    // prettier-ignore
    public getTempUnit() { return this.tempUnit }
    // prettier-ignore
    public getWindSpeedUnit() { return this.windSpeedUnit }
    // prettier-ignore
    public getPrecipitationUnit() { return this.precipitationUnit }

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

    public setUserPreferencesFromLocal() {
        if (!localStorage || !localStorage.getItem('hasLocalPrefs'))
            return
        const tempUnit = localStorage.getItem('tempUnit')
        const windSpeedUnit = localStorage.getItem('windSpeedUnit')
        const precipitationUnit = localStorage.getItem('precipitationUnit')

        if (tempUnit && this.isTemperatureUnit(tempUnit)) {
            this.tempUnit = tempUnit
        }
        if (windSpeedUnit && this.isWindSpeedUnit(windSpeedUnit)) {
            this.windSpeedUnit = windSpeedUnit
        }
        if (precipitationUnit && this.isPrecipitationUnit(precipitationUnit)) {
            this.precipitationUnit = precipitationUnit
        }
    }

    public setUserPreferences(userPrefs: UserPreferencesInterface) {
        // TODO:
        if (!this.isUserPreferences(userPrefs)) {
            console.error('Error: Bad preferences form')
            throw new Error('Invalid User Preferences')
        }
        let prop: keyof UserPreferencesInterface
        console.log('TESTING USERPREFS SETTER')
        console.log(userPrefs)
        for (prop in userPrefs) {
            console.log(prop)
            console.log(userPrefs[prop])
            console.log(this[prop])
        }
    }

    public setPrefsToLocal() {
        if (!localStorage) return
        localStorage.setItem('hasLocalPrefs', 'true')
        if (this.tempUnit)
            localStorage.setItem('tempUnit', this.tempUnit)
        if (this.windSpeedUnit)
            localStorage.setItem('windSpeedUnit', this.windSpeedUnit)
        if (this.precipitationUnit)
            localStorage.setItem('precipitationUnit', this.precipitationUnit)
    }
}

const TemperatureUnits = ['Fahrenheit', 'Celsius', 'Kelvin'] as const
const WindSpeedUnits = ['Mph', 'Kph', 'Mps'] as const
const PrecipitationUnits = ['in', 'mm', 'cm'] as const
// exporting constants array of string literals to allow for iteration and type-checking
export const Units = {
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

export const defaultUserPreferences: UserPreferencesInterface = {
    tempUnit: 'Fahrenheit',
    windSpeedUnit: 'Mph',
    precipitationUnit: 'in',
}

export function getLocalUserPreferences(): UserPreferencesInterface {
    if (!localStorage || !localStorage.getItem('hasLocalPrefs'))
        return defaultUserPreferences
    else {
        const tempUnit = localStorage.getItem('tempUnit')
        const windSpeedUnit = localStorage.getItem('windSpeedUnit')
        const precipitationUnit = localStorage.getItem('precipitationUnit')
    }
    return defaultUserPreferences
}

export function setUserPreferences(userPrefs: UserPreferencesInterface) {
    let prop: keyof UserPreferencesInterface
    for (prop in userPrefs) {
        console.log(prop)
    }
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
    isTemperatureUnit(unit: string): unit is TemperatureUnitType {
        return TemperatureUnits.includes(unit as TemperatureUnitType)
    }
    isWindSpeedUnit(unit: string): unit is WindSpeedUnitType {
        return WindSpeedUnits.includes(unit as WindSpeedUnitType)
    }
    isPrecipitationUnit(unit: string): unit is PrecipitationUnitType {
        return PrecipitationUnits.includes(unit as PrecipitationUnitType)
    }
    isUserPreferences(
        userPrefs: UserPreferencesInterface
    ): userPrefs is UserPreferencesInterface {
        //TODO: Testing
        if (userPrefs instanceof UserPrefs) return true
        else return false
    }

    //Getters
    // prettier-ignore
    getTempUnit() { return this.tempUnit }
    // prettier-ignore
    getWindSpeedUnit() { return this.windSpeedUnit }
    // prettier-ignore
    getPrecipitationUnit() { return this.precipitationUnit }

    getUserPreferences(): UserPreferencesInterface {
        return {
            tempUnit: this.tempUnit,
            windSpeedUnit: this.windSpeedUnit,
            precipitationUnit: this.precipitationUnit,
        }
    }

    //Setters
    setUserPreferencesFromLocal() {
        if (!localStorage || !localStorage.getItem('hasLocalPrefs'))
            return defaultUserPreferences
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

    setUserPreferences(userPrefs: UserPreferencesInterface) {
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
}

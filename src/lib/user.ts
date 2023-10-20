interface UserPreferencesInterface {
    TempUnit?: 'Fahrenheit' | 'Celsius' | 'Kelvin',
    WindSpeedUnit?: 'Mph' | 'Kph' | 'Mps',
    PrecipitationUnit?: 'in' | 'mm' | 'cm',
}

export const defaultUserPreferences: UserPreferencesInterface = {
    TempUnit: 'Fahrenheit',
    WindSpeedUnit: 'Mph',
    PrecipitationUnit: 'in',
}

const UserPreferences: UserPreferencesInterface = {}

export default function getUserPreferences(): UserPreferencesInterface {
    return UserPreferences
}
export function getUserPreferencesFromLocalStorage(): UserPreferencesInterface {
    const localUserPreferences = {
        preferences: {
            tempUnit: localStorage.getItem('tempUnit') || defaultUserPreferences.TempUnit,
            windSpeedUnit: localStorage.getItem('windSpeedUnit') || defaultUserPreferences.WindSpeedUnit,
            precipitationUnit:
                localStorage.getItem('precipitationUnit') || defaultUserPreferences.PrecipitationUnit,
        },
    }
    return defaultUserPreferences
}

export function setUserPreferences(userPrefs: UserPreferencesInterface) {
    let prop: keyof UserPreferencesInterface
    for (prop in userPrefs) {
        console.log(prop)
    }
}

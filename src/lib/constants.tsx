export const enum ANIMATION_PREF {
    NONE = 'None',
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}
export const enum TEMPERATURE_UNIT {
    FAHRENHEIT = '°F',
    CELSIUS = '°C',
}
export const enum PRECIPITATION_UNIT {
    INCH = 'in.',
    MM = 'mm',
}
export const enum WIND_UNIT {
    MS = 'ms',
    KPH = 'kph',
    MPH = 'mph',
    KN = 'kn',
}

export const ANIMATION_PREF_STRINGS = [
    ANIMATION_PREF.NONE,
    ANIMATION_PREF.LOW,
    ANIMATION_PREF.MEDIUM,
    ANIMATION_PREF.HIGH,
] as const
export const TEMPERATURE_UNIT_STRINGS = [
    TEMPERATURE_UNIT.FAHRENHEIT,
    TEMPERATURE_UNIT.CELSIUS,
] as const
export const PRECIPITATION_UNIT_STRINGS = [
    PRECIPITATION_UNIT.INCH,
    PRECIPITATION_UNIT.MM,
] as const
export const WIND_UNIT_STRINGS = [
    WIND_UNIT.MS,
    WIND_UNIT.KPH,
    WIND_UNIT.MPH,
    WIND_UNIT.KN,
] as const

export type AnimationPrefStringsType = (typeof ANIMATION_PREF_STRINGS)[number]
export type TemperatureUnitStringsType =
    (typeof TEMPERATURE_UNIT_STRINGS)[number]
export type PrecipitationUnitStringsType =
    (typeof PRECIPITATION_UNIT_STRINGS)[number]
export type WindUnitStringsType = (typeof WIND_UNIT_STRINGS)[number]

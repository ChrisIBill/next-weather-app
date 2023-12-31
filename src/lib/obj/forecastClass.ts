import {
    PRECIPITATION_UNIT,
    TEMPERATURE_UNIT,
    WIND_UNIT,
    WeatherUnitStringsType,
} from '../constants'
import {
    HourlyForecastObjectType,
    StringLiteralType,
    StringLiteralUnion,
} from '../interfaces'
import { numToFixed } from '../lib'
import logger from '../pinoLogger'
import { _convertToInch } from './precipitation'
import { _convertToFahrenheit, convertToUserTemp } from './temperature'
import { kphToKn, kphToMph, kphToMs } from './wind'

export interface ForecastObjectType<T> {
    value: number
    (unit: StringLiteralType<T>): StringLiteralType<T>
    [key: string]: number | (() => number) | string | (() => string) | Function
}

export const convertToUserUnit = <T extends string>(
    value: number,
    unit: WeatherUnitStringsType
) => {
    switch (unit) {
        case TEMPERATURE_UNIT.CELSIUS:
            return value
        case TEMPERATURE_UNIT.FAHRENHEIT:
            return numToFixed(_convertToFahrenheit(value), 0)
        case PRECIPITATION_UNIT.MM:
            return value
        case PRECIPITATION_UNIT.INCH:
            return numToFixed(_convertToInch(value), 2)
        case WIND_UNIT.KPH:
            return value
        case WIND_UNIT.MPH:
            return numToFixed(kphToMph(value), 1)
        case WIND_UNIT.MS:
            return numToFixed(kphToMs(value), 0)
        case WIND_UNIT.KN:
            return numToFixed(kphToKn(value), 2)
    }
}

export const ForecastObjectLogger = logger.child({ module: 'ForecastObject' })
export const MemoLogger = logger.child({ module: 'MemoTesting' })
export const WindLogger = ForecastObjectLogger.child({ component: 'WindClass' })
export const PrecipitationLogger = ForecastObjectLogger.child({
    component: 'PrecipitationClass',
})
export const TemperatureLogger = ForecastObjectLogger.child({
    component: 'TemperatureClass',
})

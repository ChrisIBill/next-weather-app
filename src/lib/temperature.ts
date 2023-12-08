import { useUser } from './context'
import { TemperatureEnum, TemperatureUnitType, TemperatureUnits } from './user'

const LOWEST_TEMPERATURE = -40
const MEDIAN_TEMPERATURE = 21
const HIGHEST_TEMPERATURE = 50
const COLD_TEMPERATURE_RANGE = MEDIAN_TEMPERATURE - LOWEST_TEMPERATURE
const HOT_TEMPERATURE_RANGE = HIGHEST_TEMPERATURE - MEDIAN_TEMPERATURE
export interface TemperatureClassType {
    _celsius: number
    _fahrenheit: number | (() => number)
    _magnitude: number | (() => number)
    userUnit: () => TemperatureUnitStrings
    getUserValue: () => number
    getMagnitude: () => number
}
const TemperatureStringMap = {
    '°F': TemperatureEnum.fahrenheit,
    '°C': TemperatureEnum.celsius,
}
const toStringUnitMap = {
    [TemperatureEnum.fahrenheit]: '°F',
    [TemperatureEnum.celsius]: '°C',
}
export const TEMPERATURE_UNIT_STRINGS = ['°F', '°C'] as const
export type TemperatureUnitStrings = (typeof TEMPERATURE_UNIT_STRINGS)[number]

export default class TemperatureClass implements TemperatureClassType {
    _celsius: number
    _fahrenheit: (() => number) | number
    _magnitude: (() => number) | number
    userUnit: () => TemperatureUnitStrings

    constructor(degrees: number, getUserUnit: () => TemperatureUnitStrings) {
        this._celsius = degrees
        this._fahrenheit = () => this.convertToFahrenheit(degrees)
        this._magnitude = () => this.generateMagnitude()
        this.userUnit = getUserUnit
    }

    getUserValue(): number {
        return this.userUnit() === '°F'
            ? typeof this._fahrenheit === 'function'
                ? this._fahrenheit()
                : this._fahrenheit
            : this._celsius
    }
    getMagnitude(): number {
        return typeof this._magnitude === 'function'
            ? this._magnitude()
            : this._magnitude
    }
    convertToFahrenheit(temp: number): number {
        this._fahrenheit = (temp * 9) / 5 + 32
        return this._fahrenheit
    }
    private generateMagnitude = (): number => {
        try {
            if (this._celsius < LOWEST_TEMPERATURE) this._magnitude = -1
            else if (this._celsius > HIGHEST_TEMPERATURE) this._magnitude = 1
            else if (this._celsius <= MEDIAN_TEMPERATURE)
                this._magnitude =
                    (this._celsius - LOWEST_TEMPERATURE) /
                        COLD_TEMPERATURE_RANGE -
                    1
            else if (this._celsius > MEDIAN_TEMPERATURE)
                this._magnitude =
                    (this._celsius - MEDIAN_TEMPERATURE) / HOT_TEMPERATURE_RANGE
            else throw new Error('Temperature magnitude error')
        } catch (err) {
            console.error(err)
            this._magnitude = 0
        } finally {
            return this._magnitude as number
        }
    }
}

import { useUser } from './context'
import { TemperatureEnum, TemperatureUnitType, TemperatureUnits } from './user'

export interface TemperatureUnitType {
    fahrenheit: number | (() => number)
    celsius: number | (() => number)
    unit: TemperatureEnum
}
const apiTempUnitMap = {
    '°F': TemperatureEnum.fahrenheit,
    '°C': TemperatureEnum.celsius,
}
const toStringUnitMap = {
    [TemperatureEnum.fahrenheit]: '°F',
    [TemperatureEnum.celsius]: '°C',
}
export type ApiTempUnitStrings = '°F' | '°C'

type tempPropertiesType = number | (() => number)
export default class TemperatureClass {
    fahrenheit: tempPropertiesType
    celsius: tempPropertiesType
    unit: TemperatureUnitType

    constructor(temp: number, unit: ApiTempUnitStrings) {
        this.unit = apiTempUnitMap[unit]
        this.fahrenheit =
            this.unit === TemperatureEnum.fahrenheit
                ? temp
                : () => this.convertToFahrenheit(temp)
        this.celsius =
            this.unit === TemperatureEnum.celsius
                ? temp
                : () => this.convertToCelsius(temp)
    }

    convertToFahrenheit(temp: number): number {
        console.log('converting to fahrenheit')
        this.unit = TemperatureEnum.fahrenheit
        return (temp * 9) / 5 + 32
    }
    convertToCelsius(temp: number): number {
        console.log('converting to celsius')
        this.unit = TemperatureEnum.celsius
        return ((temp - 32) * 5) / 9
    }

    async formattedString(unit: TemperatureUnitType): Promise<string> {
        if (typeof this[unit] !== 'number') {
            const temp = await (this[unit] as Function)()
            return `${temp.toFixed(1)}${toStringUnitMap[unit]}`
        }
        return `${(this[unit] as number).toFixed(1)}${toStringUnitMap[unit]}`
    }
}

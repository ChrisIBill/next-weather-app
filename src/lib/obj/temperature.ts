const LOWEST_TEMPERATURE = -40
const MEDIAN_TEMPERATURE = 21
const HIGHEST_TEMPERATURE = 50
const COLD_TEMPERATURE_RANGE = MEDIAN_TEMPERATURE - LOWEST_TEMPERATURE
const HOT_TEMPERATURE_RANGE = HIGHEST_TEMPERATURE - MEDIAN_TEMPERATURE
export interface TemperatureClassType {
    _celsius?: number
    _appCelsius?: number
    _celsiusRange?: number[]
    _appCelsiusRange?: number[]
}
export const TEMPERATURE_UNIT_STRINGS = ['°F', '°C'] as const
export type TemperatureUnitStrings = (typeof TEMPERATURE_UNIT_STRINGS)[number]
type NumUnionType = number | number[]

//class _TemperatureClass implements TemperatureClassType {
//    _celsius?: number
//    _appCelsius?: number
//    _celsiusRange?: number[]
//    _appCelsiusRange?: number[]
//    constructor() {}
//    _convertKeyToFahrenheit = <K extends keyof TemperatureClassType>(vals: TemperatureClassType[K], key: K): number => {
//        if (!vals) throw new Error('Value is undefined')
//        if (typeof vals === 'number' && typeof this[key] === 'number') {
//            this[key] = (vals * 9) / 5 + 32
//        }
//        else if (typeof vals === 'number'[])
//        return this[key]
//    }
//}

export interface TemperatureClassType {
    _tempDisplayString: (() => string) | string
    _appTempDisplayString: (() => string) | string
    getMagnitude: () => number
    getAppMagnitude: () => number
    getTempDisplayString: () => string
    getAppTempDisplayString: () => string
    getUserTempRange?: () => number[]
}
export interface DayTemperatureClassType extends TemperatureClassType {
    _celsiusRange: number[]
    _appCelsiusRange: number[]
    _fahrenheitRange: (() => number[]) | number[]
    _appFahrenheitRange: (() => number[]) | number[]
    _magnitude: (() => number) | number
    _appMagnitude: (() => number) | number
    userUnit: () => TemperatureUnitStrings
    hours: HourTemperatureClassType[]
    current?: HourTemperatureClassType
    _convertToFahrenheit: (vals: NumUnionType) => NumUnionType
    _calcTemperatureMagnitude: (vals: NumUnionType) => NumUnionType
}

export default class DayTemperatureClass implements TemperatureClassType {
    _celsiusRange: number[]
    _appCelsiusRange: number[]
    _fahrenheitRange: (() => number[]) | number[]
    _appFahrenheitRange: (() => number[]) | number[]
    _magnitude: (() => number) | number
    _appMagnitude: (() => number) | number
    _tempDisplayString: (() => string) | string
    _appTempDisplayString: (() => string) | string
    userUnit: () => TemperatureUnitStrings
    hours: HourTemperatureClassType[]
    current?: HourTemperatureClassType
    constructor(
        celsiusRange: [number?, number?],
        appCelsiusRange: [number?, number?],
        getUserUnit: () => TemperatureUnitStrings
    ) {
        this._celsiusRange = celsiusRange.map((temp) => temp || NaN)
        this._appCelsiusRange = appCelsiusRange.map((temp) => temp || NaN)
        this._magnitude = () => this.generateMagnitude()
        this._appMagnitude = () => this.generateAppMagnitude()
        this.userUnit = getUserUnit
        this.hours = []
        this._fahrenheitRange = () => this.generateFahrenheitRange()
        this._appFahrenheitRange = () => this.generateAppFahrenheitRange()
        this._tempDisplayString = () => this.generateTempDisplayString()
        this._appTempDisplayString = () => this.generateAppTempDisplayString()
    }

    getUserTempRange(): number[] {
        return this.userUnit() === '°F'
            ? this._fahrenheitRange instanceof Function
                ? this._fahrenheitRange()
                : this._fahrenheitRange
            : this._celsiusRange
    }
    getUserAppTempRange(): number[] {
        return this.userUnit() === '°F'
            ? this._appFahrenheitRange instanceof Function
                ? this._appFahrenheitRange()
                : this._appFahrenheitRange
            : this._appCelsiusRange
    }
    getMagnitude(): number {
        return typeof this._magnitude === 'function'
            ? this._magnitude()
            : this._magnitude
    }
    getAppMagnitude(): number {
        return typeof this._appMagnitude === 'function'
            ? this._appMagnitude()
            : this._appMagnitude
    }
    getSetHour(
        getUserUnit: () => TemperatureUnitStrings,
        celsius?: number,
        appCelsius?: number
    ): HourTemperatureClassType {
        this.hours.push(
            new HourTemperatureClass(getUserUnit, this, celsius, appCelsius)
        )
        return this.hours[this.hours.length - 1]
    }
    getSetCurrent(
        getUserUnit: () => TemperatureUnitStrings,
        celsius?: number,
        appCelsius?: number
    ) {
        this.current = new HourTemperatureClass(
            getUserUnit,
            this,
            celsius,
            appCelsius
        )
        return this.current
    }
    getTempDisplayString(): string {
        return typeof this._tempDisplayString === 'function'
            ? this._tempDisplayString()
            : this._tempDisplayString
    }
    getAppTempDisplayString(): string {
        return typeof this._appTempDisplayString === 'function'
            ? this._appTempDisplayString()
            : this._appTempDisplayString
    }
    _convertToFahrenheit = (vals: NumUnionType): NumUnionType => {
        return vals instanceof Array
            ? vals.map((temp) => (temp * 9) / 5 + 32)
            : (vals * 9) / 5 + 32
    }

    private generateTempDisplayString(): string {
        const tempRange = this.getUserTempRange()
        this._tempDisplayString = `${tempRange[0]}${this.userUnit()} / ${
            tempRange[1]
        }${this.userUnit()}`
        return this._tempDisplayString
    }
    private generateAppTempDisplayString(): string {
        const tempRange = this.getUserAppTempRange()
        this._appTempDisplayString = `${tempRange[0]}${this.userUnit()} / ${
            tempRange[1]
        }${this.userUnit()}`
        return this._appTempDisplayString
    }
    private generateFahrenheitRange(): number[] {
        this._fahrenheitRange = this._convertToFahrenheit(
            this._celsiusRange
        ) as number[]
        return this._fahrenheitRange
    }
    private generateAppFahrenheitRange(): number[] {
        this._appFahrenheitRange = this._convertToFahrenheit(
            this._appCelsiusRange
        ) as number[]
        return this._appFahrenheitRange
    }
    _calcTemperatureMagnitude(vals: NumUnionType): NumUnionType {
        try {
            const avgTemp =
                typeof vals === 'number' ? vals : vals.reduce((a, b) => a + b)
            if (avgTemp < LOWEST_TEMPERATURE) return -1
            else if (avgTemp > HIGHEST_TEMPERATURE) return 1
            else if (avgTemp <= MEDIAN_TEMPERATURE)
                return (
                    (avgTemp - LOWEST_TEMPERATURE) / COLD_TEMPERATURE_RANGE - 1
                )
            else if (avgTemp > MEDIAN_TEMPERATURE)
                return (avgTemp - MEDIAN_TEMPERATURE) / HOT_TEMPERATURE_RANGE
            else throw new Error('Temperature magnitude error')
        } catch (err) {
            console.error(err)
            return 0
        }
    }
    private generateMagnitude(): number {
        this._magnitude = this._calcTemperatureMagnitude(
            this._celsiusRange
        ) as number
        return this._magnitude
    }
    private generateAppMagnitude(): number {
        this._appMagnitude = this._calcTemperatureMagnitude(
            this._appCelsiusRange
        ) as number
        return this._appMagnitude
    }
}

interface HourTemperatureClassType extends TemperatureClassType {
    _celsius: number
    _appCelsius: number
    _fahrenheit: number | (() => number)
    _appFahrenheit: number | (() => number)
    _magnitude: number | (() => number)
    _appMagnitude: number | (() => number)
    day: DayTemperatureClassType
    userUnit: () => TemperatureUnitStrings
    getUserTemp: () => number
    getUserAppTemp: () => number
    getMagnitude: () => number
    getAppMagnitude: () => number
}
export class HourTemperatureClass implements HourTemperatureClassType {
    _celsius: number
    _appCelsius: number
    _fahrenheit: number | (() => number)
    _appFahrenheit: number | (() => number)
    _magnitude: number | (() => number)
    _appMagnitude: number | (() => number)
    _tempDisplayString: (() => string) | string
    _appTempDisplayString: (() => string) | string
    day: DayTemperatureClassType
    userUnit: () => TemperatureUnitStrings
    constructor(
        getUserUnit: () => TemperatureUnitStrings,
        day: DayTemperatureClassType,
        celsius?: number,
        appCelsius?: number
    ) {
        this._celsius = celsius || NaN
        this._appCelsius = appCelsius || NaN
        this._fahrenheit = () => this.generateFahrenheit()
        this._appFahrenheit = () => this.generateAppFahrenheit()
        this._magnitude = () => this.generateMagnitude()
        this._appMagnitude = () => this.generateAppMagnitude()
        this._tempDisplayString = () => this.generateTempDisplayString()
        this._appTempDisplayString = () => this.generateAppTempDisplayString()
        this.userUnit = getUserUnit
        this.day = day
    }
    getUserTemp(): number {
        return this.userUnit() === '°F'
            ? typeof this._fahrenheit === 'function'
                ? this._fahrenheit()
                : this._fahrenheit
            : this._celsius
    }
    getUserAppTemp(): number {
        return this.userUnit() === '°F'
            ? typeof this._appFahrenheit === 'function'
                ? this._appFahrenheit()
                : this._appFahrenheit
            : this._appCelsius
    }
    getMagnitude(): number {
        return typeof this._magnitude === 'function'
            ? this._magnitude()
            : this._magnitude
    }
    getAppMagnitude(): number {
        return typeof this._appMagnitude === 'function'
            ? this._appMagnitude()
            : this._appMagnitude
    }
    getTempDisplayString(): string {
        return typeof this._tempDisplayString === 'function'
            ? this._tempDisplayString()
            : this._tempDisplayString
    }
    getAppTempDisplayString(): string {
        return typeof this._appTempDisplayString === 'function'
            ? this._appTempDisplayString()
            : this._appTempDisplayString
    }

    private generateTempDisplayString(): string {
        this._tempDisplayString = `${this.getUserTemp()}${this.userUnit()}`
        return this._tempDisplayString
    }
    private generateAppTempDisplayString(): string {
        return `${this.getUserAppTemp()}${this.userUnit()}`
    }
    private generateFahrenheit(): number {
        this._fahrenheit = this.day._convertToFahrenheit(
            this._celsius
        ) as number
        return this._fahrenheit
    }
    private generateAppFahrenheit(): number {
        this._appFahrenheit = this.day._convertToFahrenheit(
            this._appCelsius
        ) as number
        return this._appFahrenheit
    }
    private generateMagnitude(): number {
        this._magnitude = this.day._calcTemperatureMagnitude(
            this._celsius
        ) as number
        return this._magnitude
    }
    private generateAppMagnitude(): number {
        this._appMagnitude = this.day._calcTemperatureMagnitude(
            this._appCelsius
        ) as number
        return this._appMagnitude
    }
}
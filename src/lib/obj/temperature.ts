import { cloneElement } from 'react'
import { TEMPERATURE_UNIT_STRINGS, useUserPrefsStore } from '../stores'

const LOWEST_TEMPERATURE = -40
const MEDIAN_TEMPERATURE = 21
const HIGHEST_TEMPERATURE = 50
const COLD_TEMPERATURE_RANGE = MEDIAN_TEMPERATURE - LOWEST_TEMPERATURE
const HOT_TEMPERATURE_RANGE = HIGHEST_TEMPERATURE - MEDIAN_TEMPERATURE
export type TemperatureUnitStringsType =
    (typeof TEMPERATURE_UNIT_STRINGS)[number]
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
//
export function calcTemperatureMagnitude2(vals: NumUnionType): NumUnionType {
    try {
        const avgTemp =
            typeof vals === 'number' ? vals : vals.reduce((a, b) => a + b)
        switch (true) {
            case avgTemp < 50:
        }
    } catch (err) {
        console.error(err)
        return 0
    }
}

export interface TemperatureClassType {
    //_tempDisplayString: () => string
    //_appTempDisplayString: () => string
    getMagnitude: () => number
    getAppMagnitude: () => number
    getTempDisplayString: () => string
    getAppTempDisplayString: () => string
    getAvgTemp: () => number
    getUserTempRange?: () => number[]
    getUserAppTempRange?: () => number[]
    getUserTemp?: () => number
    getUserAppTemp?: () => number
}
export interface DayTemperatureClassType extends TemperatureClassType {
    _celsiusRange: number[]
    _appCelsiusRange: number[]
    _fahrenheitRange: (() => number[]) | number[]
    _appFahrenheitRange: (() => number[]) | number[]
    _magnitude: (() => number) | number
    _appMagnitude: (() => number) | number
    hours: HourTemperatureClassType[]
    current?: HourTemperatureClassType
}

function convertToFahrenheit(vals: NumUnionType): NumUnionType {
    return vals instanceof Array
        ? vals.map((temp) => Math.round((temp * 9) / 5 + 32))
        : Math.round((vals * 9) / 5 + 32)
}

export function calcTemperatureMagnitude(vals: NumUnionType): number {
    //newVal = ((oldVal - oldMin) * (newRange)) / (oldRange) + newMin
    try {
        const avgTemp =
            typeof vals === 'number' ? vals : vals.reduce((a, b) => a + b)
        if (avgTemp < LOWEST_TEMPERATURE) return -1
        else if (avgTemp > HIGHEST_TEMPERATURE) return 1
        else if (avgTemp <= MEDIAN_TEMPERATURE)
            return (
                ((avgTemp - LOWEST_TEMPERATURE) * 10) / COLD_TEMPERATURE_RANGE -
                10
            )
        else if (avgTemp > MEDIAN_TEMPERATURE)
            return ((avgTemp - MEDIAN_TEMPERATURE) * 10) / HOT_TEMPERATURE_RANGE
        else throw new Error('Temperature magnitude error')
    } catch (err) {
        console.error(err)
        return 0
    }
}

export class DayTemperatureClass implements TemperatureClassType {
    _celsiusRange: number[]
    _appCelsiusRange: number[]
    _fahrenheitRange: (() => number[]) | number[]
    _appFahrenheitRange: (() => number[]) | number[]
    _magnitude: (() => number) | number
    _appMagnitude: (() => number) | number
    //_tempDisplayString: () => string
    //_appTempDisplayString: () => string
    hours: HourTemperatureClassType[]
    current?: HourTemperatureClassType
    constructor(
        celsiusRange: [number?, number?],
        appCelsiusRange: [number?, number?]
    ) {
        this._celsiusRange = celsiusRange.map((temp) => temp ?? NaN)
        this._appCelsiusRange = appCelsiusRange.map((temp) => temp ?? NaN)
        this._magnitude = () => this.generateMagnitude()
        this._appMagnitude = () => this.generateAppMagnitude()
        this.hours = []
        this._fahrenheitRange = () => this.generateFahrenheitRange()
        this._appFahrenheitRange = () => this.generateAppFahrenheitRange()
        //this._tempDisplayString = () => this.generateTempDisplayString()
        //this._appTempDisplayString = () => this.generateAppTempDisplayString()
    }

    getUserTempRange(): number[] {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        return userUnit === '°F'
            ? this._fahrenheitRange instanceof Function
                ? this._fahrenheitRange()
                : this._fahrenheitRange
            : this._celsiusRange
    }
    getUserAppTempRange(): number[] {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        return userUnit === '°F'
            ? this._appFahrenheitRange instanceof Function
                ? this._appFahrenheitRange()
                : this._appFahrenheitRange
            : this._appCelsiusRange
    }
    getAvgTemp(): number {
        return (
            this._celsiusRange.reduce((a, b) => a + b) /
            this._celsiusRange.length
        )
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
        celsius?: number,
        appCelsius?: number
    ): HourTemperatureClassType {
        this.hours.push(new HourTemperatureClass(celsius, appCelsius, this))
        return this.hours[this.hours.length - 1]
    }
    getSetCurrent(celsius?: number, appCelsius?: number) {
        this.current = new HourTemperatureClass(celsius, appCelsius, this)
        return this.current
    }
    getTempDisplayString(): string {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        const tempRange =
            userUnit === '°F'
                ? this.getUserTempRange().map((temp) => temp.toFixed(0))
                : this.getUserTempRange().map((temp) => temp.toFixed(1))
        return `${tempRange[0]} ${userUnit} / ${tempRange[1]} ${userUnit}`
    }

    getAppTempDisplayString(): string {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        const tempRange =
            userUnit === '°F'
                ? this.getUserAppTempRange().map((temp) => temp.toFixed(0))
                : this.getUserAppTempRange().map((temp) => temp.toFixed(1))
        return `${tempRange[0]} ${userUnit} / ${tempRange[1]} ${userUnit}`
    }

    //private generateTempDisplayString(): string {
    //    const tempRange = this.getUserTempRange()
    //    const userUnit = this.userUnit()
    //    console.log('tempRange: ', tempRange, userUnit)
    //    return `${tempRange[0]}${userUnit} / ${tempRange[1]}${this.userUnit()}`
    //}
    //private generateAppTempDisplayString(): string {
    //    const tempRange = this.getUserAppTempRange()
    //    this._appTempDisplayString = `${tempRange[0]}${this.userUnit()} / ${
    //        tempRange[1]
    //    }${this.userUnit()}`
    //    return this._appTempDisplayString
    //}
    private generateFahrenheitRange(): number[] {
        this._fahrenheitRange = convertToFahrenheit(
            this._celsiusRange
        ) as number[]
        return this._fahrenheitRange
    }
    private generateAppFahrenheitRange(): number[] {
        this._appFahrenheitRange = convertToFahrenheit(
            this._appCelsiusRange
        ) as number[]
        return this._appFahrenheitRange
    }

    private generateMagnitude(): number {
        this._magnitude = calcTemperatureMagnitude(this._celsiusRange) as number
        return this._magnitude
    }
    private generateAppMagnitude(): number {
        this._appMagnitude = calcTemperatureMagnitude(
            this._appCelsiusRange
        ) as number
        return this._appMagnitude
    }
}

export interface HourTemperatureClassType extends TemperatureClassType {
    _celsius: number
    _appCelsius: number
    _fahrenheit: number | (() => number)
    _appFahrenheit: number | (() => number)
    _magnitude: number | (() => number)
    _appMagnitude: number | (() => number)
    day?: DayTemperatureClassType
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
    //_tempDisplayString: () => string
    //_appTempDisplayString: () => string
    day?: DayTemperatureClassType
    constructor(
        celsius?: number,
        appCelsius?: number,
        day?: DayTemperatureClassType
    ) {
        this._celsius = celsius ?? NaN
        this._appCelsius = appCelsius ?? NaN
        this._fahrenheit = () => this.generateFahrenheit()
        this._appFahrenheit = () => this.generateAppFahrenheit()
        this._magnitude = () => this.generateMagnitude()
        this._appMagnitude = () => this.generateAppMagnitude()
        //this._tempDisplayString = () => this.generateTempDisplayString()
        //this._appTempDisplayString = () => this.generateAppTempDisplayString()
        this.day = day ?? undefined
    }
    getUserTemp = (): number => {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        return userUnit === TEMPERATURE_UNIT_STRINGS[0]
            ? typeof this._fahrenheit === 'function'
                ? this._fahrenheit()
                : this._fahrenheit
            : this._celsius
    }
    getUserAppTemp = (): number => {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        return userUnit === '°F'
            ? typeof this._appFahrenheit === 'function'
                ? this._appFahrenheit()
                : this._appFahrenheit
            : this._appCelsius
    }
    getAvgTemp(): number {
        return this._celsius
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
    getTempDisplayString = (): string => {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        const temp =
            userUnit === '°F'
                ? this.getUserTemp().toFixed(0)
                : this.getUserTemp().toFixed(1)
        return `${temp}${userUnit}`
    }
    getAppTempDisplayString(): string {
        const userUnit = useUserPrefsStore.getState().temperatureUnit
        const temp =
            userUnit === '°F'
                ? this.getUserTemp().toFixed(0)
                : this.getUserTemp().toFixed(1)
        return `${temp}${userUnit}`
    }
    private generateFahrenheit(): number {
        this._fahrenheit = convertToFahrenheit(this._celsius) as number
        return this._fahrenheit
    }
    private generateAppFahrenheit(): number {
        this._appFahrenheit = convertToFahrenheit(this._appCelsius) as number
        return this._appFahrenheit
    }
    private generateMagnitude(): number {
        this._magnitude = calcTemperatureMagnitude(this._celsius) as number
        return this._magnitude
    }
    private generateAppMagnitude(): number {
        this._appMagnitude = calcTemperatureMagnitude(
            this._appCelsius
        ) as number
        return this._appMagnitude
    }
}

export interface TemperatureComponentWrapperProps {
    children: React.ReactNode
}

export const TemperatureComponentWrapper: React.FC<
    TemperatureComponentWrapperProps
> = (props: TemperatureComponentWrapperProps): JSX.Element => {
    const userUnit = useUserPrefsStore((state) => state.temperatureUnit)
    return cloneElement(props.children as React.ReactElement)
    //return <div>{props.children}</div>
}
export const convertToUserTemp = (
    value: number,
    tempUnit: TemperatureUnitStringsType
) => {
    if (tempUnit == '°C') return value
    else return (value * 9) / 5 + 32
}
